import {Component, computed, signal} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ErrorHandlerService} from '../../services/error-handler.service';
import {ProductService} from '../../services/product.service';
import {Product} from '../../models/product';
import {ProductType, ProductTypeLabels} from '../../models/product-type.enum';
import {ToastService} from '../../services/toast.service';
import {createPagination} from '../../utils/pagination';
import {createTableSorter} from '../../utils/sort.table';
import {PaginationComponent} from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-products-page',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    PaginationComponent
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss'
})
export class ProductsPage {

  formGroup!: FormGroup;
  pagination = createPagination(() => this.productsFiltered());
  tableSorter = createTableSorter<Product>();

  products = signal<Product[]>([])
  selected = signal<Product | null>(null);
  searchText = signal('');
  isEditing = signal(false);


  // Filter listener
  productsFiltered = computed(() => {
    let data = [...this.products()];

    if (this.searchText()) {
      const text = this.searchText().toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(text)
      );
    }

    return this.tableSorter.sortArray(data);
  });

  productTypeOptions = Object.values(ProductType);


  /**
   *
   * @param productService
   * @param formBuilder
   * @param errorHandler
   * @param toastService
   */
  constructor(private productService: ProductService,
              private formBuilder: FormBuilder,
              private errorHandler: ErrorHandlerService,
              private toastService: ToastService) {

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
    this.formGroup.reset();
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
          this.toastService.show('Producto creado', 2000, "success");
        },
        error: err => {
          this.toastService.show('Error al crear el productp', 2000, "error");
          console.error(this.errorHandler.parseError(err));
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
          this.toastService.show('Producto actualizado', 2000, "success");
        },
        error: err => {
          this.toastService.show('Error al crear el productp', 2000, "error");
          console.error(this.errorHandler.parseError(err));
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
        this.toastService.show('Producto eliminado', 2000, "success");
      },
      error: err => {
        this.toastService.show('Error al crear el productp', 2000, "error");
        console.error(this.errorHandler.parseError(err));
      }
    });
  }

  protected readonly ProductTypeLabels = ProductTypeLabels;
}
