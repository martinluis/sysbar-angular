import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {OrderService} from '../../services/order.service';
import {Observable} from 'rxjs';
import {Order} from '../../models/order';
import {AsyncPipe, DatePipe} from '@angular/common';
import {OrderType} from '../../models/order-type.enum';

@Component({
  selector: 'app-cashier-page',
  imports: [
    HeaderComponent,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './preparation-page.html',
  styleUrl: './preparation-page.scss'
})
export class PreparationPage implements OnInit{


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
