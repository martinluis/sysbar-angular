import {Component, computed, input, OnInit, signal} from '@angular/core';
import {Order} from '../../models/order';
import {OrderType} from '../../models/order-type.enum';
import {OrderItemComponent} from './order-item/order-item.component';
import {CurrencyPipe} from '@angular/common';
import {OrderItem} from '../../models/order-item';
import {OrderService} from '../../services/order.service';

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


  constructor(private orderService: OrderService) {
  }

  /**
   *
   */
  onConfirm(){
    this.orderService.confirm(this.order()).subscribe({
      next: (order) => {
        this.order().items = order.items;
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  /**
   *
   */
  onCancel(){

    // To be sure that the items are the originals from the DB only if the order exists
    if (this.order().id) {
      this.orderService.get(this.order().id).subscribe({
          next: (order) => {
            this.order().items = order.items;
          },
          error: (error) => {
            console.log(error)
          }
      });
    }
    else {
      this.order().items = []
    }

  }

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


  /**
   *
   * @param index
   * @param item
   */
  trackByItemId(index: number, item: OrderItem): number {
    return item.itemId !== null ? item.itemId : index;
  }
}
