import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
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
import {Customer} from '../../models/customer';

@Component({
  selector: 'app-manage-order-page',
  imports: [
    HeaderComponent,
    OrderSummaryComponent,
    SearchProductsComponent,
    CustomerFormComponent
  ],
  templateUrl: './order-page.html',
  styleUrl: './order-page.scss'
})
export class OrderPage implements OnInit{

  protected readonly OrderType = OrderType;
  order = signal<Order|null>(null)

  constructor(private route: ActivatedRoute,
              private orderService: OrderService,
              private tableService: TableService,
              private authService: AuthService,
              private router: Router,
              private errorHandler: ErrorHandlerService) {
  }

  /**
   *
   */
  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const tableId = params.get('tableId');
      const orderType = params.get('orderType');
      const orderId = params.get('orderId');
      if (orderId) {
        this.initOrderById(Number(orderId))
        return
      }
      if (tableId) {
        this.initOrderByTable(Number(tableId));
        return
      }
      if (orderType) {
        const type = OrderType[orderType as keyof typeof OrderType]
        this.initOrderByType(type);
        return
      }
    });
  }

  /**
   *
   * @param tableId
   * @private
   */
  private initOrderByTable(tableId: number) {
    this.orderService.getByTable(tableId).subscribe({
      next: (order) => {
        this.order.set(order)
      },
      error: (error) => {
        console.log(this.errorHandler.parseError(error))
        this.initDefaultLocalOrder(tableId)
      }
    })
  }

  /**
   *
   * @param type
   * @private
   */
  private initOrderByType(type: OrderType){
    const order = this.createOrder(null, type)
    this.order.set(order);
  }

  /**
   *
   * @param id
   * @private
   */
  private initOrderById(id: number){
    this.orderService.get(id).subscribe({
      next: order => {
        this.order.set(order);
      },
      error: err => {
        console.log(this.errorHandler.parseError(err));
        this.router.navigate(['dashboard']);
      }
    })

  }

  /**
   *
   * @private
   */
  private initDefaultLocalOrder(tableId: number){
    this.tableService.get(tableId).subscribe({
      next: (table) => {
        if (!table) {
          this.router.navigate(['dashboard']);
          return
        }
        this.order.set( this.createOrder(table, OrderType.LOCAL) )
      },
      error: err => {
        console.log(this.errorHandler.parseError(err));
        this.router.navigate(['dashboard']);
      }
    })
  }

  /**
   *
   * @param table
   * @param type
   * @private
   */
  private createOrder(table: Table | null, type: OrderType){
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
    };
  }

  /**
   *
   * @param product
   */
  onAddProduct(product: Product) {
    let productAdded = this.order()?.items.find(it => {
      return it.itemId===null && it.productId===product.id && it.comment===""
    })

    if (productAdded) {
      productAdded.quantity = productAdded.quantity + 1;
      productAdded.total = productAdded.quantity * productAdded.productPrice;
    }
    else {
      this.order()?.items.push({
        itemId: null,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: 1,
        comment: '',
        total: product.price,
        isDeleted: false,
        isUpdated: false
      })
    }
    this.order.update( o => {
      if (!o) return o; // or null
      const total = o.items.reduce((acc, item) => acc + item.total, 0);
      return { ...o, total };
    })
  }

  /**
   *
   * @param customer
   */
  onSaveCustomer(customer: Customer) {
    this.order.update( o => {
      if (!o) return o; // or null
      return { ...o, customer };
    })
    console.log( this.order());
  }

}
