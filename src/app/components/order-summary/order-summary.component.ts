import {AfterViewInit, Component, effect, ElementRef, input, ViewChild} from '@angular/core';
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
export class OrderSummaryComponent implements AfterViewInit {

  order = input.required<Order>();
  isEditable = input<boolean>(true);
  @ViewChild(InfoModal) infoModal!: InfoModal;
  @ViewChild(ConfirmModal) confirmModal!: ConfirmModal;
  @ViewChild('contentSummary') private contentSummary!: ElementRef<HTMLDivElement>;
  isItemsModified = false;


  /**
   *
   * @param orderService
   */
  constructor(private orderService: OrderService) {
    effect(() => {
      this.isItemsModified = this.order().items.some(item => item.itemId === null);
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  /**
   *
   */
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  /**
   *
   */
  onConfirm(){
    if (!this.validateOrder()) return;
    this.orderService.confirm(this.order()).subscribe({
      next: (order) => {
        this.order().items = order.items;
        this.order().id = order.id
        this.infoModal.open("Order Confirmada!" , 200);
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
  onUpdateItems() {
    this.isItemsModified = true;
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
      this.orderService.get(this.order().id!).subscribe({
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
   * @private
   */
  private validateOrder(): boolean{
    if (this.order().items.length === 0) {
      this.infoModal.open("La orden no puede estar vacia", 5);
      return false;
    }
    if (this.order().orderType && this.order().orderType===OrderType.DELIVERY) {
      if (!this.order().customer) {
        this.infoModal.open("Debe ingresar informacion del cliente", 5);
        return false;
      }
    }
    if (this.order().orderType && this.order().orderType===OrderType.PERSONAL) {
      if (!this.order().reference || this.order().reference === "") {
        this.infoModal.open("Debe ingresar el nombre o referencia", 5);
        return false;
      }
    }
    return true;
  }

  /**
   *
   */
  get headerTitle(): string {
    let headerTitle = "";
    switch (this.order()?.orderType) {
      case OrderType.LOCAL:
        headerTitle = this.order().table!.name
        break;
      case OrderType.DELIVERY:
        headerTitle = "A domicilio"
        break;
      case OrderType.PERSONAL:
        headerTitle = "Personal"
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

  /**
   *
   * @private
   */
  private scrollToBottom() {
    const el = this.contentSummary.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
