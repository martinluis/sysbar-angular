import {AfterViewInit, Component, DestroyRef, effect, ElementRef, input, ViewChild} from '@angular/core';
import {Order} from '../../models/order';
import {OrderType} from '../../models/order-type.enum';
import {OrderItemComponent} from './order-item/order-item.component';
import {CurrencyPipe} from '@angular/common';
import {OrderItem} from '../../models/order-item';
import {OrderService} from '../../services/order.service';
import {ConfirmModal} from '../commons/confirm-modal/confirm.modal';
import {ToastService} from '../../services/toast.service';
import {firstValueFrom} from 'rxjs';
import {CustomerService} from '../../services/customer.service';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {finalize} from 'rxjs';

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
  isSaving = false;

  /**
   *
   * @param orderService
   * @param toastService
   */
  constructor(private orderService: OrderService,
              private toastService: ToastService,
              private customerService: CustomerService,
              private errorHandler: ErrorHandlerService,
              private destroyRef: DestroyRef) {
    effect(() => {
      this.isItemsModified = this.order().items.some(
        item => item.itemId === null || item.isUpdated || item.isDeleted
      );
      setTimeout(() => this.scrollToBottom(), 100);
    });

  }

  /** Scrolls the item list to the newest item after the view is initialized. */
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  /** Validates and saves the current order changes, then replaces local items with the server response. */
  onConfirm() {
    if (this.isSaving || !this.validateOrder()) return;
    this.isSaving = true;
    this.orderService.confirm(this.order()).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isSaving = false)
    ).subscribe({
      next: (order) => {
        this.order().items = order.items;
        this.order().id = order.id;
        this.removeEmptyItems();
        this.updateTotal();
        this.toastService.show("Orden Confirmada", 2000, "success");
        this.isItemsModified = false;
      },
      error: (error) => {
        this.toastService.show(this.errorHandler.parseError(error), 3000, "error");
      },
    });
  }

  /** Marks the order as changed after an item component updates its contents. */
  onUpdateItems() {
    this.isItemsModified = true;
  }

  /** Confirms cancellation and restores the current order from the server or clears a new draft. */
  async onCancel() {
    if (this.isSaving || !this.isItemsModified) return;
    const confirmed = await this.confirmModal.open(
      'Desea cancelar los cambios en la orden?'
    );

    if (confirmed) {
      try {
        await this.cancelOrder();
        this.isItemsModified = false;
      } catch (error) {
        this.toastService.show(this.errorHandler.parseError(error), 3000, "error");
      }
    }

    this.updateTotal();
  }

  /** Recalculates the order total while excluding items marked for deletion. */
  private updateTotal() {
    this.order().total = this.order().items.reduce(
      (total, item) => item.isDeleted ? total : total + item.total,
      0
    );
  }

  /** Reloads a saved order or clears the contents of an unsaved draft. */
  private async cancelOrder() {
    const orderId = this.order().id;
    if (orderId !== null) {
      const order = await firstValueFrom(this.orderService.get(orderId));
      this.order().items = order.items;
      this.order().customer = order.customer;
    } else {
      this.order().items = [];
    }
    this.updateTotal();
  }

  /** Ensures the order has active items and required delivery or personal-order details. */
  private validateOrder(): boolean {
    const customerState = this.customerService.customerFormState();
    const activeItems = this.order().items.filter(item => !item.isDeleted && item.quantity > 0);
    if (activeItems.length === 0) {
      this.toastService.show("La orden no puede estar vacia", 5000, "warning")
      return false;
    }
    if (this.order().orderType === OrderType.DELIVERY) {
      if (customerState.valid) {
        this.order().customer = customerState.customer;
      }
      else {
        this.toastService.show("Debe ingresar informacion del cliente", 5000, "warning")
        return false;
      }
    }
    if (this.order().orderType === OrderType.PERSONAL) {
      if (!this.order().reference.trim()) {
        this.toastService.show("Debe ingresar el nombre o referencia", 5000, "warning")
        return false;
      }
    }
    return true;
  }

  /** Removes unsaved and zero-quantity items after a successful save. */
  private removeEmptyItems() {
    this.order().items = this.order().items.filter(
      item => item.itemId !== null && item.quantity > 0 && !item.isDeleted
    );
  }

  /** Returns a display title for the order type and its table when available. */
  get headerTitle(): string {
    let headerTitle = "";
    switch (this.order()?.orderType) {
      case OrderType.LOCAL:
        headerTitle = this.order().table?.name ?? "Mesa";
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


  /** Returns a stable track key for persisted items and a positional key for draft items. */
  trackByItemId(index: number, item: OrderItem): number {
    return item.itemId !== null ? item.itemId : index;
  }

  /** Scrolls to the bottom of the order list when its view element exists. */
  private scrollToBottom() {
    const el = this.contentSummary?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
