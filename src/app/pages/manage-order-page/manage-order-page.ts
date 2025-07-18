import {Component, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {HeaderComponent} from '../../components/header/header.component';
import {OrderSummaryComponent} from '../../components/order-summary/order-summary.component';
import {NgIf} from '@angular/common';
import {OrderType} from '../../models/order-type.enum';

@Component({
  selector: 'app-manage-order-page',
  imports: [
    HeaderComponent,
    OrderSummaryComponent,
    NgIf
  ],
  templateUrl: './manage-order-page.html',
  styleUrl: './manage-order-page.scss'
})
export class ManageOrderPage implements OnInit{

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

  protected readonly OrderType = OrderType;
}
