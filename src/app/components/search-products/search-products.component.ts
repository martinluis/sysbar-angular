import {Component, effect, OnInit, output, signal} from '@angular/core';
import {Product} from '../../models/product';
import {ProductItemComponent} from './product-item/product-item.component';
import {ProductService} from '../../services/product.service';
import {FormsModule} from '@angular/forms';
import {ProductType} from '../../models/product-type.enum';

@Component({
  selector: 'app-search-products',
  imports: [
    ProductItemComponent,
    FormsModule
  ],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.scss'
})
export class SearchProductsComponent implements OnInit{

  onAddProduct = output<Product>()
  private _products: Product[] = []; // All products
  keyword = signal<string>("");
  filterType = signal<ProductType | null>(null) ;
  products: Product[] = []


  /**
   *
   * @param productService
   */
  constructor(private productService: ProductService) {
    effect(() => {
      this.products = this.filterProducts(this.keyword(), this.filterType());
    });
  }

  /**
   *
   */
  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this._products = data;
        this.products = data;
      }
    });
  }


  /**
   *
   * @param product
   */
  addProduct(product: Product){
    this.onAddProduct.emit(product)
  }

  /**
   *
   */
  onFilterAll() {
    this.filterType.set(null);
  }

  /**
   *
   */
  onFilterFood() {
    this.filterType.set(ProductType.FOOD);
  }

  /**
   *
   */
  onFilterDrink() {
    this.filterType.set(ProductType.DRINK);
  }

  /**
   *
   * @param keyword
   * @param type
   * @private
   */
  private filterProducts(keyword: string , type: ProductType | null): Product[]{
    let products = this._products.filter(it => {
          if (keyword === "" || keyword.length < 2) {
            return this._products;
          }
          return it.name.toLowerCase().includes(keyword.toLowerCase());
      });
    if (type != null ) {
       products = products.filter(it => it.type === type);
    }
    return products
  }

  protected readonly ProductType = ProductType;
}
