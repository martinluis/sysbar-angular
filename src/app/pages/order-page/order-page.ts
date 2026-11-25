import {Component, DestroyRef, OnInit, signal, ViewChild, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {PrinterService} from '../../services/printer.service';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {HeaderComponent} from '../../components/header/header.component';
import {OrderSummaryComponent} from '../../components/order-summary/order-summary.component';
import {OrderType} from '../../models/order-type.enum';
import {SearchProductsComponent} from '../../components/search-products/search-products.component';
import {Product} from '../../models/product';
import {OrderStatus} from '../../models/order-status.enum';
import {Table} from '../../models/table';
import {TableService} from '../../services/table.service';
import {AuthService} from '../../services/auth.service';
import {CustomerFormComponent} from '../../components/customer-form/customer-form.component';
import {MoveTableModal} from '../../components/move-table-modal/move-table.modal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Role} from '../../models/role.enum';
import {ToastService} from '../../services/toast.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {catchError, map, Observable, of, switchMap} from 'rxjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-manage-order-page',
  imports: [
    HeaderComponent,
    OrderSummaryComponent,
    SearchProductsComponent,
    CustomerFormComponent,
    MoveTableModal,
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './order-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './order-page.scss'
})
export class OrderPage implements OnInit {

  protected readonly OrderType = OrderType;
  order = signal<Order|null>(null)
  @ViewChild(MoveTableModal) moveTableModal!: MoveTableModal;

  constructor(private route: ActivatedRoute,
              private orderService: OrderService,
              private printerService: PrinterService,
              private tableService: TableService,
              private authService: AuthService,
              private toastService: ToastService,
              private router: Router,
              private destroyRef: DestroyRef,
              private errorHandler: ErrorHandlerService,
              private translate: TranslateService) {
  }

  /** Initializes the order based on the current route query parameters. */
  ngOnInit() {
    this.route.queryParamMap.pipe(
      switchMap(params => {
        const orderId = params.get('orderId');
        if (orderId !== null) {
          const id = this.parsePositiveId(orderId);
          if (id === null) {
            return this.invalidOrderRequest();
          }
          return this.loadOrderById(id);
        }

        const tableId = params.get('tableId');
        if (tableId !== null) {
          const id = this.parsePositiveId(tableId);
          if (id === null) {
            return this.invalidOrderRequest();
          }
          return this.loadOrderByTable(id);
        }

        const orderType = params.get('orderType');
        if (orderType !== null) {
          const type = Object.values(OrderType).find(value => value === orderType);
          if (type === undefined) {
            return this.invalidOrderRequest();
          }
          return of(this.createOrder(null, type));
        }

        return this.invalidOrderRequest();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(order => this.order.set(order));
  }

  /** Loads an active order for a table, or creates a new local order when none exists. */
  private loadOrderByTable(tableId: number): Observable<Order | null> {
    return this.orderService.getByTable(tableId).pipe(
      catchError(error => {
        console.error(this.errorHandler.parseError(error));
        return this.tableService.get(tableId).pipe(
          map(table => {
            if (!table) {
              this.router.navigate(['dashboard']);
              return null;
            }
            return this.createOrder(table, OrderType.LOCAL);
          }),
          catchError(tableError => {
            console.error(this.errorHandler.parseError(tableError));
            this.router.navigate(['dashboard']);
            return of(null);
          })
        );
      })
    );
  }

  /** Loads an order by ID and redirects away if it cannot be loaded or is inactive. */
  private loadOrderById(id: number): Observable<Order | null> {
    return this.orderService.get(id).pipe(
      map(order => {
        if (order.status !== OrderStatus.ACTIVE) {
          this.router.navigate(['dashboard']);
          return null;
        }
        return order;
      }),
      catchError(error => {
        console.error(this.errorHandler.parseError(error));
        this.router.navigate(['dashboard']);
        return of(null);
      })
    );
  }

  /** Notifies the user that the route does not identify a valid order and redirects to the dashboard. */
  private invalidOrderRequest(): Observable<null> {
    this.toastService.show(this.translate.instant('PAGES_A.ORDER.INVALID_ORDER'), 2000, 'error');
    this.router.navigate(['dashboard']);
    return of(null);
  }

  /** Parses a route parameter as a positive, safe integer ID. */
  private parsePositiveId(value: string): number | null {
    if (!/^\d+$/.test(value)) {
      return null;
    }

    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  }

  /** Creates a new empty active order for the specified type and optional table. */
  private createOrder(table: Table | null, type: OrderType): Order {
    const user = this.authService.getUser();
    return {
      id: null,
      items: [],
      table: table,
      user: user,
      orderType: type,
      total: 0,
      status: OrderStatus.ACTIVE,
      customer: null,
      discount: 0,
      subtotal: 0,
      reference: "",
      createdAt: null
    };
  }

  /** Adds a product to the current order, combining matching unsaved items and recalculating the total. */
  onAddProduct(product: Product) {
    const productId = product.id;
    if (productId === null) {
      this.toastService.show(this.translate.instant('PAGES_A.ORDER.ADD_PRODUCT_ERROR'), 2000, 'error');
      return;
    }

    this.order.update(order => {
      if (!order) {
        return order;
      }

      const items = [...order.items];
      const productAddedIndex = items.findIndex(item =>
        item.itemId === null && item.productId === productId && item.comment === ''
      );
      if (productAddedIndex >= 0) {
        const item = items[productAddedIndex];
        const quantity = item.quantity + 1;
        items[productAddedIndex] = {
          ...item,
          quantity,
          total: quantity * item.productPrice
        };
      } else {
        items.push({
          itemId: null,
          productId,
          productName: product.name,
          productPrice: product.price,
          quantity: 1,
          comment: '',
          total: product.price,
          isDeleted: false,
          isUpdated: false
        });
      }

      return {
        ...order,
        items,
        total: items.reduce((total, item) => total + item.total, 0)
      };
    })
  }

  /** Navigates to the payment page for the current saved order. */
  onPay() {
    const orderId = this.order()?.id;
    if (orderId === null || orderId === undefined) {
      return
    }
    this.router.navigate(['pay'], {
      queryParams: { orderId }
    })
  }

  /** Navigates to the partial-payment page for the current saved order. */
  onPartialPay() {
    const orderId = this.order()?.id;
    if (orderId === null || orderId === undefined) {
      return
    }
    this.router.navigate(['partial-pay'], {
      queryParams: { orderId }
    })
  }

  /** Opens the dialog for selecting a destination table. */
  onMoveTable() {
    this.moveTableModal.open();
  }

  /** Prints the ticket for the current saved order and displays the operation result. */
  onPrintTicket() {
    const orderId = this.order()?.id;
    if (orderId === null || orderId === undefined) {
      return;
    }

    this.printerService.printTicket(orderId).subscribe({
      next: () => {
        this.toastService.show(this.translate.instant('PAGES_A.ORDER.PRINT_SUCCESS'), 1000, "success");
      },
      error: err => {
        this.toastService.show(this.translate.instant('PAGES_A.ORDER.PRINT_ERROR'), 2000, "error");
        console.error(err);
      }
    })
  }

  /** Moves the current order to the selected table and returns to the waiter page. */
  onConfirmMoveTable(tableId: number) {
    const order = this.order();
    if (!order?.id) {
      return;
    }

    this.orderService.changeTable(order, tableId).subscribe({
      next: () => {
        this.router.navigate(['waiter']);
      },
      error: err => {
        console.error(err);
      }
    })
  }

  /** Checks whether the current user has at least one of the specified roles. */
  hasPermissions(roles: Role[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  protected readonly Role = Role;
}
