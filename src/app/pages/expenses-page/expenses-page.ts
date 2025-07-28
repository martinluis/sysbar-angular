import {Component, computed, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HeaderComponent} from "../../components/header/header.component";
import {Expense} from '../../models/expense';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {ExpenseService} from '../../services/expense.service';
import {CurrencyPipe} from '@angular/common';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-expenses-page',
  imports: [
    FormsModule,
    HeaderComponent,
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './expenses-page.html',
  styleUrl: './expenses-page.scss'
})
export class ExpensesPage {

  formGroup!: FormGroup;
  expenses = signal<Expense[]>([])
  selected = signal<Expense | null>(null);
  searchText = signal('');
  isEditing = signal(false);
  expensesFiltered = computed(() => {
    const term = this.searchText().toLowerCase();
    return this.expenses().filter(item =>
      item.description.toLowerCase().includes(term)
    );
  });


  /**
   *
   * @param expenseService
   * @param authService
   * @param formBuilder
   * @param errorHandler
   */
  constructor(private expenseService: ExpenseService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private errorHandler: ErrorHandlerService) {

  }

  /**
   *
   */
  ngOnInit(): void {
    this.expenseService.findActives().subscribe({
      next: expenses => {
        this.expenses.set(expenses);
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
      description: ["", [Validators.required]],
      amount: ["", [Validators.required, Validators.min(1)]],
    });
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.selected.set(null);
    this.isEditing.set(false);
    this.searchText.set("");
    this.formGroup.patchValue({id: null, description: '', amount: ''});
    this.formGroup.reset();
  }

  /**
   * Add a new record
   */
  add(): void {
    if (this.formGroup.valid) {
      const newExpense: Expense = this.formGroup.value;
      newExpense.user = this.authService.getUser();
      this.expenseService.save(newExpense).subscribe({
        next: table => {
          this.expenses.set([...this.expenses(), table]);
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
  edit(table: Expense): void {
    this.selected.set(table);
    this.isEditing.set(true);
    this.formGroup.patchValue(table);
  }

  /**
   * Update an existing record
   */
  update(): void {
    if (this.formGroup.valid) {
      const newExpense: Expense = this.formGroup.value;
      newExpense.user = this.authService.getUser();
      this.expenseService.save(newExpense).subscribe({
        next: expense => {
          const updatedTables = this.expenses().map(t =>
            t.id === expense.id ? { ...expense } : t
          );
          this.expenses.set(updatedTables);
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
    this.expenseService.delete(id).subscribe({
      next: () => {
        const expenses = this.expenses().filter(it => it.id !== id);
        this.expenses.set(expenses);
      },
      error: err => {
        console.log(this.errorHandler.parseError(err));
      }
    });
  }

}
