import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {HeaderComponent} from '../../components/header/header.component';
import {OrderSummaryComponent} from '../../components/order-summary/order-summary.component';
import {OrderType} from '../../models/order-type.enum';
import {SearchProductsComponent} from '../../components/search-products/search-products.component';
import {Product} from '../../models/product';

@Component({
  selector: 'app-manage-order-page',
  imports: [
    HeaderComponent,
    OrderSummaryComponent,
    SearchProductsComponent
  ],
  templateUrl: './order-page.html',
  styleUrl: './order-page.scss'
})
export class OrderPage implements OnInit{

  protected readonly OrderType = OrderType;
  order = signal<Order|null>(null)

  constructor(private route: ActivatedRoute,
              private orderService: OrderService,
              private errorHandler: ErrorHandlerService) {
  }

  /**
   *
   */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('tableId');
    this.initOrder(Number(id))
  }

  /**
   *
   * @param tableId
   * @private
   */
  private initOrder(tableId: number) {
    this.orderService.getByTable(tableId).subscribe({
      next: (order) => {
        this.order.set(order)
      },
      error: (error) => {
        console.log(this.errorHandler.parseError(error))
        this.initDefaultOrder()
      }
    })
  }

  /**
   *
   * @private
   */
  private initDefaultOrder(){

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

}
