import {Component, effect, input, ViewChild} from '@angular/core';
import {Order} from '../../models/order';
import {OrderType} from '../../models/order-type.enum';
import {OrderItemComponent} from './order-item/order-item.component';
import {CurrencyPipe} from '@angular/common';
import {OrderItem} from '../../models/order-item';
import {OrderService} from '../../services/order.service';
import {InfoModal} from '../commons/info-modal/info.modal';
import {ConfirmModal} from '../commons/confirm-modal/confirm.modal';

@Component({
  selector: 'app-order-summary',
  imports: [
    OrderItemComponent,
    CurrencyPipe,
    InfoModal,
    ConfirmModal
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent{

  order = input.required<Order>();
  @ViewChild(InfoModal) infoModal!: InfoModal;
  @ViewChild(ConfirmModal) confirmModal!: ConfirmModal;
  isItemsModified = false;


  /**
   *
   * @param orderService
   */
  constructor(private orderService: OrderService) {
    effect(() => {
      this.isItemsModified = this.order().items.some(item => item.itemId === null);
    });
  }

  /**
   *
   */
  onConfirm(){
    this.orderService.confirm(this.order()).subscribe({
      next: (order) => {
        this.order().items = order.items;
        this.infoModal.open("Order Confirmada!");
        this.isItemsModified = false;
      },
      error: (error) => {
        console.log(error)
      }
    });
  }

  /**
   *
   */
  async onCancel(){
    const confirmed = await this.confirmModal.open('Desea cancelar los cambios en la orden?');
    if (confirmed) {
      this.cancelOrder();
      this.isItemsModified = false;
    }
  }

  /**
   *
   * @private
   */
  private cancelOrder (){
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
