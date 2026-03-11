import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../services/order.service';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {HeaderComponent} from '../../components/header/header.component';
import {OrderSummaryComponent} from '../../components/order-summary/order-summary.component';
import {Order} from '../../models/order';
import {CurrencyPipe} from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ConfirmModal} from '../../components/commons/confirm-modal/confirm.modal';
import {OrderStatus} from '../../models/order-status.enum';

@Component({
  selector: 'app-pay-page',
  imports: [
    HeaderComponent,
    OrderSummaryComponent,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    ConfirmModal,
  ],
  templateUrl: './pay-page.html',
  styleUrl: './pay-page.scss'
})
export class PayPage implements OnInit {

  @ViewChild(ConfirmModal) confirmModal!: ConfirmModal;

  order!: Order;
  paymentForm!: FormGroup;
  totalAmount: number = 0; // Example base total
  finalTotal: number = 0;  // Will be updated live
  isLoading = false;

  /**
   *
   * @param route
   * @param orderService
   * @param router
   * @param fb
   * @param errorHandler
   */
  constructor(private route: ActivatedRoute,
              private orderService: OrderService,
              private router: Router,
              private fb: FormBuilder,
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
        this.finalTotal = this.order.total;
        this.totalAmount =  this.order.total;
        this.updateCashValidator();
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
    this.paymentForm = this.fb.group({
      discount: [null, [Validators.min(1), Validators.max(99)]],
      cash: [null, [Validators.min(1), this.cashEnoughValidator(this.finalTotal)]]
    });

    this.paymentForm.get('discount')?.valueChanges.subscribe(value => {
      if (this.paymentForm.get('discount')?.valid) {
        const discountValue = Number(value);
        this.finalTotal = this.calculateTotalWithDiscount(discountValue);
      } else {
        this.finalTotal = this.totalAmount; // Reset if invalid
      }
      this.updateCashValidator();
    });
  }

  /**
   *
   */
  onPay() {
    if (this.paymentForm.valid) {
      this.isLoading = true
      this.orderService.pay(this.order,this.paymentForm.get('discount')?.value, this.paymentForm.get('cash')?.value).subscribe({
        next: order => {
          this.isLoading = false
          this.confirmCashBack().then(
            () => this.router.navigate(['dashboard'])
          )
        },
        error: err => {
          this.isLoading = false
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
   * @param discount
   * @private
   */
  private calculateTotalWithDiscount(discount: number): number {
    return this.totalAmount - (this.totalAmount * (discount / 100));
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
      this.cashEnoughValidator(this.finalTotal)
    ]);
    this.paymentForm.get('cash')?.updateValueAndValidity();
  }


  /**
   *
   */
  async confirmCashBack(){
    const cashBack = this.paymentForm.get('cash')?.value - this.finalTotal;
    const cashBackFormated = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cashBack);
    await this.confirmModal.open(`Cambio: ${cashBackFormated} `);
  }

  /**
   *
   * @param event
   */
  limitDiscount(event: any): void {
    let value = event.target.value;

    if (value > 99) {
      event.target.value = 99;
      this.paymentForm.get('discount')?.setValue(99, { emitEvent: true });
    }

    if (value < 0) {
      event.target.value = 0;
      this.paymentForm.get('discount')?.setValue(0, { emitEvent: true });
    }
  }

}



