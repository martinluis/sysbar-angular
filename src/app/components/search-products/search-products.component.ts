import {Component, computed, DestroyRef, OnInit, output, signal} from '@angular/core';
import {Product} from '../../models/product';
import {ProductItemComponent} from './product-item/product-item.component';
import {ProductService} from '../../services/product.service';
import {FormsModule} from '@angular/forms';
import {ProductType} from '../../models/product-type.enum';
import {catchError, of} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {ToastService} from '../../services/toast.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-search-products',
  imports: [
    ProductItemComponent,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.scss'
})
export class SearchProductsComponent implements OnInit {

  onAddProduct = output<Product>();
  private allProducts = signal<Product[]>([]);
  keyword = signal<string>("");
  filterType = signal<ProductType | null>(null);
  products = computed(() => this.filterProducts(this.allProducts(), this.keyword(), this.filterType()));


  constructor(private productService: ProductService,
              private errorHandler: ErrorHandlerService,
              private toastService: ToastService,
              private destroyRef: DestroyRef,
              private translate: TranslateService) {
  }

  /** Loads the product catalog used by the search and category filters. */
  ngOnInit(): void {
    this.productService.getAll().pipe(
      catchError(error => {
        this.toastService.show(this.errorHandler.parseError(error), 3000, "error");
        return of([]);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(products => this.allProducts.set(products));
  }


  /** Emits a selected product to the parent order editor. */
  addProduct(product: Product) {
    if (product.id === null) {
      this.toastService.show(this.translate.instant('COMPONENTS.PRODUCTS.ADD_ERROR'), 2000, "error");
      return;
    }
    this.onAddProduct.emit(product)
  }

  /** Removes the category filter and displays all matching products. */
  onFilterAll() {
    this.filterType.set(null);
  }

  /** Filters the product list to food items. */
  onFilterFood() {
    this.filterType.set(ProductType.FOOD);
  }

  /** Filters the product list to drink items. */
  onFilterDrink() {
    this.filterType.set(ProductType.DRINK);
  }

  /** Applies the name search and optional category filter to the loaded product catalog. */
  private filterProducts(products: Product[], keyword: string, type: ProductType | null): Product[] {
    const searchTerm = keyword.trim().toLocaleLowerCase();
    return products.filter(product => {
      const matchesName = searchTerm.length < 2
        || product.name.toLocaleLowerCase().includes(searchTerm);
      const matchesType = type === null || product.type === type;
      return matchesName && matchesType;
    });
  }

  protected readonly ProductType = ProductType;
}
