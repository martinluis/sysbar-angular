import {AfterViewInit, Component, effect, ElementRef, input, ViewChild} from '@angular/core';
import {Order} from '../../models/order';
import {OrderType} from '../../models/order-type.enum';
import {OrderItemComponent} from './order-item/order-item.component';
import {CurrencyPipe} from '@angular/common';
import {OrderItem} from '../../models/order-item';
import {OrderService} from '../../services/order.service';
import {ConfirmModal} from '../commons/confirm-modal/confirm.modal';
import {ToastService} from '../../services/toast.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-order-summary',
  imports: [
    OrderItemComponent,
    CurrencyPipe,
    ConfirmModal
  ],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.scss'
})
export class OrderSummaryComponent implements AfterViewInit {

  order = input.required<Order>();
  isEditable = input<boolean>(true);
  @ViewChild(ConfirmModal) confirmModal!: ConfirmModal;
  @ViewChild('contentSummary') private contentSummary!: ElementRef<HTMLDivElement>;
  isItemsModified = false;


  /**
   *
   * @param orderService
   * @param toastService
   */
  constructor(private orderService: OrderService, private toastService: ToastService) {
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
        this.removeEmptyItems();
        this.toastService.show("Orden Confirmada", 2000, "success")
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
  async onCancel() {
    const confirmed = await this.confirmModal.open(
      'Desea cancelar los cambios en la orden?'
    );

    if (confirmed) {
      await this.cancelOrder();
      this.isItemsModified = false;
    }

    this.updateTotal();
  }


  /**
   *
   * @private
   */
  private updateTotal() {
    this.order().total = this.order().items.reduce((acc, item) => acc + item.total, 0)
  }


  /**
   *
   * @private
   */
  private async cancelOrder() {
    if (this.order().id) {
      try {
        const order = await firstValueFrom(
          this.orderService.get(this.order().id!)
        );

        this.order().items = order.items;

      } catch (error) {
        console.log(error);
      }
    } else {
      this.order().items = [];
    }
  }

  /**
   *
   * @private
   */
  private validateOrder(): boolean{
    if (this.order().items.length === 0) {
      this.toastService.show("La orden no puede estar vacia", 5000, "warning")
      return false;
    }
    if (this.order().orderType && this.order().orderType===OrderType.DELIVERY) {
      if (!this.order().customer) {
        this.toastService.show("Debe ingresar informacion del cliente", 5000, "warning")
        return false;
      }
    }
    if (this.order().orderType && this.order().orderType===OrderType.PERSONAL) {
      if (!this.order().reference || this.order().reference === "") {
        this.toastService.show("Debe ingresar el nombre o referencia", 5000, "warning")
        return false;
      }
    }
    return true;
  }

  /**
   *
   * @private
   */
  private removeEmptyItems() {
    this.order().items = this.order().items.filter(item => item.itemId !== null && item.quantity > 0);
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
