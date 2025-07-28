import {Component, computed, input, OnInit, signal} from '@angular/core';
import {Table} from '../../models/table';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '../../components/header/header.component';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {TableService} from '../../services/table.service';

@Component({
  selector: 'app-tables-page',
  imports: [
    FormsModule,
    CommonModule,
    HeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './tables-page.html',
  styleUrl: './tables-page.scss'
})
export class TablesPage implements OnInit {

  formGroup!: FormGroup;
  tables = signal<Table[]>([])
  selected = signal<Table | null>(null);
  searchText = signal('');
  isEditing = signal(false);
  tablesFiltered = computed(() => {
    const term = this.searchText().toLowerCase();
    return this.tables().filter(item =>
      item.name.toLowerCase().includes(term)
    );
  });


  /**
   *
   * @param tableService
   * @param formBuilder
   * @param errorHandler
   */
  constructor(private tableService: TableService,
              private formBuilder: FormBuilder,
              private errorHandler: ErrorHandlerService) {

  }


  /**
   *
   */
  ngOnInit(): void {
    this.tableService.getAll().subscribe({
      next: tables => {
        this.tables.set(tables);
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
    });
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.selected.set(null);
    this.isEditing.set(false);
    this.searchText.set("");
    const emptyTable: Table = {id: null, isBusy: false, name: ''}
    this.formGroup.patchValue(emptyTable);
    this.formGroup.reset();
  }

  /**
   * Add a new record
   */
  add(): void {
    if (this.formGroup.valid) {
      const newTable: Table = this.formGroup.value;
      this.tableService.save(newTable).subscribe({
        next: table => {
          this.tables.set([...this.tables(), table]);
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
  edit(table: Table): void {
    this.selected.set(table);
    this.isEditing.set(true);
    this.formGroup.patchValue(table);
  }

  /**
   * Update an existing record
   */
  update(): void {
    if (this.formGroup.valid) {
      const newTable: Table = this.formGroup.value;
      this.tableService.save(newTable).subscribe({
        next: table => {
          const updatedTables = this.tables().map(t =>
            t.id === table.id ? { ...table } : t
          );
          this.tables.set(updatedTables);
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
    this.tableService.delete(id).subscribe({
      next: result => {
        const tables = this.tables().filter(it => it.id !== id);
        this.tables.set(tables);
      },
      error: err => {
        console.log(this.errorHandler.parseError(err));
      }
    });
  }

}
