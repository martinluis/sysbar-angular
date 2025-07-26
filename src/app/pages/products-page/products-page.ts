import {Component, computed, signal} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ErrorHandlerService} from '../../services/error-handler.service';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product';
import {ProductType, ProductTypeLabels} from '../../models/product-type.enum';

@Component({
  selector: 'app-products-page',
    imports: [
        HeaderComponent,
        ReactiveFormsModule
    ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss'
})
export class ProductsPage {

  formGroup!: FormGroup;
  products = signal<Product[]>([])
  selected = signal<Product | null>(null);
  searchText = signal('');
  isEditing = signal(false);
  productsFiltered = computed(() => {
    const term = this.searchText().toLowerCase();
    return this.products().filter(item =>
      item.name.toLowerCase().includes(term)
    );
  });
  productTypeOptions = Object.values(ProductType);


  /**
   *
   * @param productService
   * @param formBuilder
   * @param errorHandler
   */
  constructor(private productService: ProductService,
              private formBuilder: FormBuilder,
              private errorHandler: ErrorHandlerService) {

  }


  /**
   *
   */
  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: products => {
        this.products.set(products);
      }
    });
    this.initFormControl()
  }


  /**
   *
   * @private
   */
  private initFormControl() {
    this.formGroup = this.formBuilder.group({
      id: [null, []],
      name: ["", [Validators.required]],
      type: [ProductType.FOOD, [Validators.required]],
      price: ["", [Validators.required, Validators.min(1)]],
      stock: ["", [Validators.min(0)]],
    });
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.selected.set(null);
    this.isEditing.set(false);
    this.searchText.set("");
    this.formGroup.patchValue({id: null, name: '', price: '', stock: '', type: ProductType.FOOD});
  }

  /**
   * Add a new record
   */
  add(): void {
    if (this.formGroup.valid) {
      const newTable: Product = this.formGroup.value;
      this.productService.save(newTable).subscribe({
        next: table => {
          this.products.set([...this.products(), table]);
        },
        error: err => {
          console.log(this.errorHandler.parseError(err));
        }
      });
    }
    this.resetForm();
  }

  /**
   * Add a new record
   * @param table
   */
  edit(table: Product): void {
    this.selected.set(table);
    this.isEditing.set(true);
    this.formGroup.patchValue(table);
  }

  /**
   * Update an existing record
   */
  update(): void {
    if (this.formGroup.valid) {
      const newTable: Product = this.formGroup.value;
      this.productService.save(newTable).subscribe({
        next: product => {
          const updatedTables = this.products().map(t =>
            t.id === product.id ? { ...product } : t
          );
          this.products.set(updatedTables);
        },
        error: err => {
          console.log(this.errorHandler.parseError(err));
        }
      });
    }
    this.resetForm();
  }


  /**
   * Delete a record by ID
   * @param id
   */
  delete(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => {
        const products = this.products().filter(it => it.id !== id);
        this.products.set(products);
      },
      error: err => {
        console.log(this.errorHandler.parseError(err));
      }
    });
  }

  protected readonly ProductTypeLabels = ProductTypeLabels;
}
