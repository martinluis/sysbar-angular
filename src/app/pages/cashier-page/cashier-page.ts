import {Component, OnInit, signal} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {OrderService} from '../../services/order.service';
import {catchError, Observable, of} from 'rxjs';
import {Order} from '../../models/order';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import {OrderType} from '../../models/order-type.enum';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Role} from '../../models/role.enum';
import {ToastService} from '../../services/toast.service';
import {PrinterService} from '../../services/printer.service';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-cashier-page',
  imports: [
    HeaderComponent,
    AsyncPipe,
    DatePipe,
    CurrencyPipe,
    TranslatePipe
  ],
  templateUrl: './cashier-page.html',
  styleUrl: './cashier-page.scss'
})
export class CashierPage implements OnInit{

  orders$!: Observable<Order[]>;
  orderSelected = signal<Order|null>(null);
  isDeleting = false;
  isPrinting = false;

  constructor(private orderService: OrderService,
              private printerService: PrinterService,
              private router: Router,
              private toastService: ToastService,
              private errorHandler: ErrorHandlerService,
              private authService: AuthService,
              private translate: TranslateService) {
  }

  /** Loads active orders for display in the cashier's order list. */
  ngOnInit(): void {
    this.loadActiveOrders();
  }

  /** Selects an active order so its details and available actions are displayed. */
  onSelectOrder(order: Order) {
    this.orderSelected.set(order);
  }

  /** Navigates to payment for the selected order when it has a valid ID. */
  onPay() {
    const orderId = this.getSelectedOrderId();
    if (orderId === null) {
      return;
    }

    this.router.navigate(['pay'], {
      queryParams: { orderId }
    })
  }

  /** Navigates to partial payment for the selected order when it has a valid ID. */
  onPartialPay() {
    const orderId = this.getSelectedOrderId();
    if (orderId === null) {
      return;
    }

    this.router.navigate(['partial-pay'], {
      queryParams: { orderId }
    })
  }

  /** Navigates to the order editor for the selected order when it has a valid ID. */
  onUpdateOrder() {
    const orderId = this.getSelectedOrderId();
    if (orderId === null) {
      return;
    }

    this.router.navigate(['order'], {
      queryParams: { orderId }
    })
  }

  /** Deletes the selected order, clears the selection, and reloads the active-order list. */
  onDeleteOrder() {
    const orderId = this.getSelectedOrderId();
    if (orderId === null || this.isDeleting) {
      return;
    }

    this.isDeleting = true;
    this.orderService.delete(orderId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.toastService.show(this.translate.instant('PAGES_A.CASHIER.ORDER_DELETED'), 2000, "success");
        this.loadActiveOrders();
        this.orderSelected.set(null);
      },
      error: err => {
        this.isDeleting = false;
        this.toastService.show(this.errorHandler.parseError(err), 3000, "error");
      }
    })
  }

  /** Prints a ticket for the selected order and reports success or failure. */
  onPrintTicket() {
    const orderId = this.getSelectedOrderId();
    if (orderId === null || this.isPrinting) {
      return;
    }

    this.isPrinting = true;
    this.printerService.printTicket(orderId).subscribe({
      next: () => {
        this.isPrinting = false;
        this.toastService.show(this.translate.instant('PAGES_A.CASHIER.PRINT_SUCCESS'), 1000, "success");
      },
      error: err => {
        this.isPrinting = false;
        this.toastService.show(this.errorHandler.parseError(err), 3000, "error");
      }
    })
  }

  /** Returns a user-facing description based on the order type and its associated details. */
  getTypeDescription(order: Order): string {
    switch (order.orderType) {
      case OrderType.PERSONAL:
        return this.translate.instant('PAGES_A.ORDER_TYPE.PERSONAL', {reference: order.reference});
      case OrderType.LOCAL:
        return order.table?.name ?? this.translate.instant('PAGES_A.ORDER_TYPE.TABLE');
      case OrderType.DELIVERY:
        return this.translate.instant('PAGES_A.ORDER_TYPE.DELIVERY');
    }
  }

  /** Checks whether the current user has at least one of the specified roles. */
  hasPermissions(roles: Role[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  /** Loads active orders and reports API failures instead of leaving the async view in an error state. */
  private loadActiveOrders(): void {
    this.orders$ = this.orderService.getAllActives().pipe(
      catchError(error => {
        this.toastService.show(this.errorHandler.parseError(error), 3000, "error");
        return of([]);
      })
    );
  }

  /** Returns the selected order ID only when it is a positive safe integer. */
  private getSelectedOrderId(): number | null {
    const id = this.orderSelected()?.id;
    if (id !== null && id !== undefined && Number.isSafeInteger(id) && id > 0) {
      return id;
    }
    this.toastService.show(this.translate.instant('PAGES_A.CASHIER.SELECT_VALID_ORDER'), 2000, "warning");
    return null;
  }

  protected readonly OrderType = OrderType;
  protected readonly Role = Role;
}
