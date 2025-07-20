import { Component } from '@angular/core';
import {OrderItem} from '../../../models/order-item';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-order-item-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './order-item-modal.component.html',
  styleUrl: './order-item-modal.component.scss'
})
export class OrderItemModalComponent {

  show = false;
  private _resolve!: (result: OrderItem | null) => void;
  item!: OrderItem

  /**
   *
   */
  open(item: OrderItem): Promise<OrderItem|null> {
    this.show = true;
    this.item = { ...item }; // Cloning the original
      return new Promise<OrderItem|null>((resolve) => {
      this._resolve = resolve;
    });
  }

  /**
   *
   * @param result
   */
  confirm(result: boolean) {
    this.show = false;
    if (result) {
      this._resolve(this.item);
    }
    else {
      this._resolve(null);
    }
  }


  /**
   *
   */
  onAdd(){
    this.item.quantity++;
    this.item.total = this.item.quantity * this.item.productPrice;
    this.item.isUpdated = true;
  }

  /**
   *
   */
  onSubtract() {
    if (this.item.quantity > 0) {
      this.item.quantity--;
      this.item.total = this.item.quantity * this.item.productPrice;
      this.item.isUpdated = true;
    }
  }
}
