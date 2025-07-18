import {Component, input} from '@angular/core';
import {OrderItem} from '../../../models/order-item';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-order-item',
  imports: [
    CurrencyPipe
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss'
})
export class OrderItemComponent {

  orderItem = input.required<OrderItem>()


}
