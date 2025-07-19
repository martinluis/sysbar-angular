import {Component, computed, input, OnInit, signal} from '@angular/core';
import {Order} from '../../models/order';
import {OrderType} from '../../models/order-type.enum';
import {OrderItemComponent} from './order-item/order-item.component';
import {CurrencyPipe} from '@angular/common';
import {OrderItem} from '../../models/order-item';

@Component({
  selector: 'app-order-summary',
  imports: [
    OrderItemComponent,
    CurrencyPipe
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent{

  order = input.required<Order>();


  /**
   *
   */
  get headerTitle(): string {
    let headerTitle = "";
    switch (this.order()?.orderType) {
      case OrderType.LOCAL:
        headerTitle = this.order().table.name
        break;
      case OrderType.DELIVERY:
        headerTitle = "A domicilio"
        break;
      case OrderType.PERSONAL:
        this.order().user.name
        break;
    }
    return headerTitle;
  }
}
