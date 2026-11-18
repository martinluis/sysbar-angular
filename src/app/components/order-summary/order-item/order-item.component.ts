import {Component, input, output, ViewChild} from '@angular/core';
import {OrderItem} from '../../../models/order-item';
import {CurrencyPipe} from '@angular/common';
import {Order} from '../../../models/order';
import {OrderItemModalComponent} from '../order-item-modal/order-item-modal.component';
import {AuthService} from '../../../services/auth.service';
import {Role} from '../../../models/role.enum';

@Component({
  selector: 'app-order-item',
  imports: [
    CurrencyPipe,
    OrderItemModalComponent
  ],
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss'
})
export class OrderItemComponent {

  orderItem = input.required<OrderItem>()
  order = input.required<Order>()
  isEditable = input<boolean>(true)
  onUpdateItem = output()
  @ViewChild(OrderItemModalComponent) editModal!: OrderItemModalComponent;

  constructor(private authService: AuthService) {
  }

  /** Adds one unit and restores an existing item if it had been marked for deletion. */
  onAdd() {
    const item = this.orderItem();
    item.quantity++;
    item.total = item.quantity * item.productPrice;
    item.isUpdated = item.itemId !== null;
    item.isDeleted = false;
    this.updateTotal();
  }

  /** Removes one unit, deleting a draft item at zero and marking persisted items for deletion. */
  onSubtract() {
    const item = this.orderItem();
    if (item.quantity <= 0) {
      return;
    }

    item.quantity--;
    item.total = item.quantity * item.productPrice;
    if (item.quantity === 0) {
      if (item.itemId === null) {
        this.order().items = this.order().items.filter(orderItem => orderItem !== item);
      } else {
        item.isDeleted = true;
        item.isUpdated = false;
      }
    } else if (item.itemId !== null) {
      item.isUpdated = true;
    }
    this.updateTotal();
  }

  /** Applies the confirmed comment and quantity changes from the item editor. */
  async onEdit() {
    const confirmedItem = await this.editModal.open(this.orderItem());
    if (confirmedItem) {
      const item = this.orderItem();
      item.comment = confirmedItem.comment;
      item.quantity = confirmedItem.quantity;
      item.total = item.quantity * item.productPrice;
      item.isUpdated = item.itemId !== null;
      item.isDeleted = item.quantity === 0 && item.itemId !== null;
      this.updateTotal();
    }
  }

  /** Marks a persisted item for deletion or removes an unsaved draft item. */
  onDelete() {
    const item = this.orderItem();
    if (item.itemId !== null) {
      item.isDeleted = true;
      item.isUpdated = false;
    }
    else {
      this.order().items = this.order().items.filter(orderItem => orderItem !== item);
    }
    this.updateTotal();
  }

  /** Recalculates the non-deleted order total and notifies the summary of item changes. */
  private updateTotal() {
    this.order().total = this.order().items.reduce(
      (acc, item) => item.isDeleted ? acc : acc + item.total,
      0
    );
    this.onUpdateItem.emit();
  }

  /** Indicates whether this persisted item is marked for deletion. */
  get isDeleted(): boolean {
    return this.orderItem().itemId!==null && this.orderItem().isDeleted;
  }

  /** Indicates whether this item has pending local changes. */
  get isModified(): boolean {
    return !this.orderItem().itemId || this.orderItem().isUpdated;
  }

  /** Checks whether the current user has at least one of the specified roles. */
  hasPermissions(roles: Role[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  protected readonly Role = Role;
}
