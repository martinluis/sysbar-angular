import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HeaderComponent} from '../../../components/header/header.component';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {Role} from '../../../models/role.enum';
import {OrderType} from '../../../models/order-type.enum';
import {Order} from '../../../models/order';
import {CashcutService} from '../../../services/cashcut.service';
import {Cashcut} from '../../../models/cashcut';
import {AuthService} from '../../../services/auth.service';
import {Expense} from '../../../models/expense';
import {ExpenseService} from '../../../services/expense.service';

@Component({
  selector: 'app-cashcut-detail-page',
  imports: [
    HeaderComponent,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './cashcut-detail-page.html',
  styleUrl: './cashcut-detail-page.scss'
})
export class CashcutDetailPage implements OnInit {

  cashcut = signal<Cashcut|null>(null);
  expenses  = signal<Expense[]>([]);
  orderSelected!: Order

  /**
   *
   * @param route
   * @param cashcutService
   * @param expenseService
   * @param authService
   */
  constructor(private route: ActivatedRoute,
              private cashcutService: CashcutService,
              private expenseService: ExpenseService,
              private authService: AuthService) {}

  /**
   *
   */
  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    this.cashcutService.get(Number(userId), true).subscribe({
      next: response => {
        this.cashcut.set(response);
      },
      error: err => {

      }
    });
    this.expenseService.findActives().subscribe({
      next: expenses => {
        this.expenses.set(expenses);
      }
    });
  }

  /**
   *
   * @param order
   */
  onSelectOrder(order: Order) {
    this.orderSelected = order;
  }

  /**
   *
   * @param order
   */
  getTypeDescription(order: Order): string {
    switch (order.orderType) {
      case OrderType.PERSONAL:
        return `Personal - ${order.reference}`;
      case OrderType.LOCAL:
        return order.table?.name ?? "Mesa";
      case OrderType.DELIVERY:
        return "A domicilio";
    }
  }

  /**
   *
   */
  hasPermissions(roles: Role[]): boolean {
    return this.authService.hasAnyRole(roles);
  }


  protected readonly Role = Role;
  protected readonly OrderType = OrderType;
}
