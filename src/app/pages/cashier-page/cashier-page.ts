import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {OrderService} from '../../services/order.service';
import {Observable} from 'rxjs';
import {Order} from '../../models/order';
import {AsyncPipe, DatePipe} from '@angular/common';
import {OrderType} from '../../models/order-type.enum';
import {OrderSummaryComponent} from '../../components/order-summary/order-summary.component';

@Component({
  selector: 'app-cashier-page',
  imports: [
    HeaderComponent,
    AsyncPipe,
    DatePipe,
    OrderSummaryComponent
  ],
  templateUrl: './cashier-page.html',
  styleUrl: './cashier-page.scss'
})
export class CashierPage implements OnInit{


  orders$!: Observable<Order[]>;
  orderSelected!: Order

  constructor(private orderServices: OrderService) {
  }

  /**
   *
   */
  ngOnInit(): void {
     this.orders$ = this.orderServices.getAllActives();
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
          return "Personal";
        case OrderType.LOCAL:
          return order.table?.name ?? "Mesa";
        case OrderType.DELIVERY:
          return "A domicilio";
      }
  }


  protected readonly OrderType = OrderType;
}
