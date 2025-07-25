import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../services/order.service';
import {OrderStatus} from '../../models/order-status.enum';
import {Order} from '../../models/order';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {OrderItem} from '../../models/order-item';
import {HeaderComponent} from '../../components/header/header.component';
import {CurrencyPipe} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {ConfirmModal} from '../../components/commons/confirm-modal/confirm.modal';

@Component({
  selector: 'app-partial-pay-page',
  imports: [
    HeaderComponent,
    CurrencyPipe,
    ReactiveFormsModule,
    ConfirmModal
  ],
  templateUrl: './partial-pay-page.html',
  styleUrl: './partial-pay-page.scss'
})
export class PartialPayPage implements OnInit {

  order!: Order;
  originalItems: OrderItem[] = [];
  partialItems: OrderItem[] = [];
  paymentForm!: FormGroup;
  total: number = 0.01; // Example base total
  isLoading = false;
  @ViewChild(ConfirmModal) confirmModal!: ConfirmModal;



  /**
   *
   * @param route
   * @param orderService
   * @param router
   * @param formBuilder
   * @param errorHandler
   */
  constructor(private route: ActivatedRoute,
              private orderService: OrderService,
              private router: Router,
              private formBuilder: FormBuilder,
              private errorHandler: ErrorHandlerService) {

  }

  /**
   *
   */
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const orderId = params.get('orderId');
      if (orderId) {
        this.initView(Number(orderId))
        return
      }
      else {
        this.router.navigate(['dashboard']);
      }
    });
    this.initFormControl();
  }


  /**
   *
   * @param id
   * @private
   */
  private initView(id: number) {
    this.orderService.get(id).subscribe({
      next: order => {
        if (order.status !== OrderStatus.ACTIVE) {
          console.log("Order is not active");
          this.router.navigate(['dashboard']);
        }
        this.order = order;
        this.originalItems = order.items;
      },
      error: err => {
        console.log(this.errorHandler.parseError(err));
        this.router.navigate(['dashboard']);
      }
    })
  }


  /**
   *
   * @private
   */
  private initFormControl() {
    this.paymentForm = this.formBuilder.group({
      cash: [null, [Validators.min(1), this.cashEnoughValidator(this.total)]]
    });

  }

  /**
   *
   * @param item
   * @param direction
   */
  moveItem(item: OrderItem, direction: 'leftToRight' | 'rightToLeft') {
    const toList = direction === 'leftToRight' ? this.partialItems : this.originalItems;

    if (item.quantity > 0) {
      item.quantity -= 1;
      const existing = toList.find(i => i.itemId === item.itemId);
      if (existing) {
        existing.quantity += 1;
      } else {
        toList.push({ ...item, quantity: 1 });
      }
    }
    this.partialItems = this.partialItems.filter(i => i.quantity > 0);
    this.updateTotal();
  }

  /**
   *
   * @param item
   * @private
   */
  calculateTotal(item: OrderItem): number {
    return item.quantity * item.productPrice;
  }

  /**
   *
   */
  updateTotal() {
    this.total = this.partialItems.reduce((acc, item) => acc + this.calculateTotal(item), 0);
    this.updateCashValidator();
  }


  /**
   *
   */
  onPay() {
    if (this.paymentForm.valid) {
      this.isLoading = true;
      this.orderService.partialPay(this.order, this.partialItems, this.paymentForm.get('cash')?.value).subscribe({
        next: order => {
          this.isLoading = true;
          this.confirmCashBack().then(
            () => this.router.navigate(['dashboard'])
          )
        },
        error: err => {
          this.isLoading = true;
          console.log(this.errorHandler.parseError(err));
        }
      });
    }
    else {
      this.paymentForm.markAllAsTouched();
    }
  }

  /**
   *
   */
  cancel() {
    this.router.navigate(['dashboard']);
  }

  /**
   *
   * @param minAmount
   */
  cashEnoughValidator(minAmount: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = Number(control.value);
      if (isNaN(value)) return null;
      return value < minAmount ? { notEnoughCash: true } : null;
    };
  }

  /**
   * Call updateCashValidator() whenever finalTotal changes.
   */
  updateCashValidator() {
    this.paymentForm.get('cash')?.setValidators([
      Validators.required,
      this.cashEnoughValidator(this.total)
    ]);
    this.paymentForm.get('cash')?.updateValueAndValidity();
  }


  /**
   *
   */
  async confirmCashBack(){
    const cashBack = this.paymentForm.get('cash')?.value - this.total;
    const cashBackFormated = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cashBack);
    await this.confirmModal.open(`Cambio: ${cashBackFormated} `);
  }

}
