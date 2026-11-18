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

  /** Opens the editor with a copy so cancelling does not mutate the order item. */
  open(item: OrderItem): Promise<OrderItem|null> {
    this.show = true;
    this.item = { ...item };
    return new Promise<OrderItem|null>((resolve) => {
      this._resolve = resolve;
    });
  }

  /** Closes the editor and resolves with the edited item or null when cancelled. */
  confirm(result: boolean) {
    this.show = false;
    if (result) {
      this._resolve(this.item);
    }
    else {
      this._resolve(null);
    }
  }


  /** Increases the draft quantity and recalculates its total. */
  onAdd(){
    this.item.quantity++;
    this.item.total = this.item.quantity * this.item.productPrice;
    this.item.isUpdated = true;
  }

  /** Decreases the draft quantity without allowing the editor to save an empty item. */
  onSubtract() {
    if (this.item.quantity > 1) {
      this.item.quantity--;
      this.item.total = this.item.quantity * this.item.productPrice;
      this.item.isUpdated = true;
    }
  }
}
