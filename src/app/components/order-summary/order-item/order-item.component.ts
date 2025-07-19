import {Component, input, output} from '@angular/core';
import {OrderItem} from '../../../models/order-item';
import {CurrencyPipe} from '@angular/common';
import {Order} from '../../../models/order';

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
  order = input.required<Order>()


  /**
   *
   */
  onAdd(){
    this.orderItem().quantity++;
    this.orderItem().total = this.orderItem().quantity * this.orderItem().productPrice;
    this.updateTotal()
  }

  /**
   *
   */
  onSubtract() {
    if (this.orderItem().quantity > 0) {
      this.orderItem().quantity--;
      this.orderItem().total = this.orderItem().quantity * this.orderItem().productPrice;
      this.updateTotal()
    }
  }

  /**
   *
   */
  onDelete() {
    this.order().items = this.order().items.filter(it => it.itemId !== this.orderItem().itemId)
    this.updateTotal()
  }

  /*8

   */
  private updateTotal() {
    this.order().total = this.order().items.reduce((acc, item) => acc + item.total, 0)
  }
}
