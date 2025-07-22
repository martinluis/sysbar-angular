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

  /**
   *
   */
  onAdd(){
    this.orderItem().quantity++;
    this.orderItem().total = this.orderItem().quantity * this.orderItem().productPrice;
    this.orderItem().isUpdated = true;
    this.updateTotal();
  }

  /**
   *
   */
  onSubtract() {
    if (this.orderItem().quantity > 0) {
      this.orderItem().quantity--;
      this.orderItem().total = this.orderItem().quantity * this.orderItem().productPrice;
      this.orderItem().isUpdated = true;
      this.updateTotal()
    }
  }

  /**
   *
   */
  async onEdit() {
    const confirmedItem = await this.editModal.open(this.orderItem());
    if (confirmedItem) {
      this.orderItem().comment = confirmedItem.comment;
      this.orderItem().quantity = confirmedItem.quantity;
      this.orderItem().total = this.orderItem().quantity * this.orderItem().productPrice;
      this.orderItem().isUpdated = true;
      this.updateTotal();
    }
  }

  /**
   *
   */
  onDelete() {
    if (this.orderItem().itemId) {
      this.orderItem().isDeleted = true;
    }
    else {
      this.order().items = this.order().items.filter(it => it !== this.orderItem())
    }
    this.updateTotal();
  }

  /*8

   */
  private updateTotal() {
    this.onUpdateItem.emit();
    this.order().total = this.order().items.reduce((acc, item) => acc + item.total, 0)
  }

  /**
   *
   */
  get isDeleted(): boolean {
    return this.orderItem().itemId!==null && this.orderItem().isDeleted;
  }

  /**
   *
   */
  get isModified(): boolean {
    return !this.orderItem().itemId || this.orderItem().isUpdated;
  }

  /**
   *
   */
  hasPermissions(roles: Role[]): boolean {
    return this.authService.hasAnyRole(roles);
  }

  protected readonly Role = Role;
}
