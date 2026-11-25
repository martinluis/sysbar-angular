import {Component, DestroyRef, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
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
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {ConfirmModal} from '../../components/commons/confirm-modal/confirm.modal';
import {OrderStatus} from '../../models/order-status.enum';
import {ToastService} from '../../services/toast.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {catchError, firstValueFrom, map, Observable, of, switchMap} from 'rxjs';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-pay-page',
  imports: [
    HeaderComponent,
    OrderSummaryComponent,
    CurrencyPipe,
    ReactiveFormsModule,
    ConfirmModal,
    TranslatePipe,
  ],
  templateUrl: './pay-page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './pay-page.scss'
})
export class PayPage implements OnInit {

  @ViewChild(ConfirmModal) confirmModal!: ConfirmModal;

  order: Order | null = null;
  paymentForm!: FormGroup;
  totalAmount = 0;
  finalTotal = 0;
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
              private destroyRef: DestroyRef,
              private toastService: ToastService,
              private translate: TranslateService,
              private errorHandler: ErrorHandlerService) {

  }

  /** Initializes the payment form and loads the requested order from the route. */
  ngOnInit(): void {
    this.initFormControl();

    this.route.queryParamMap.pipe(
      switchMap(params => {
        const orderId = params.get('orderId');
        const id = orderId === null ? null : this.parsePositiveId(orderId);
        if (id === null) {
          this.toastService.show(this.translate.instant('PAGES_B.PAY.ORDER_NOT_IDENTIFIED'), 2000, 'error');
          this.router.navigate(['dashboard']);
          return of(null);
        }
        return this.loadOrder(id);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(order => {
      this.order = order;
      if (order) {
        this.totalAmount = order.total;
        this.finalTotal = order.total;
        this.updateCashValidator();
      }
    });
  }

  /** Loads an active order by ID, redirecting and reporting errors for invalid orders. */
  private loadOrder(id: number): Observable<Order | null> {
    return this.orderService.get(id).pipe(
      map(order => {
        if (order.status !== OrderStatus.ACTIVE) {
          this.toastService.show(this.translate.instant('PAGES_B.PAY.ORDER_INACTIVE'), 2000, 'error');
          this.router.navigate(['dashboard']);
          return null;
        }
        return order;
      }),
      catchError(error => {
        this.toastService.show(this.errorHandler.parseError(error), 3000, 'error');
        this.router.navigate(['dashboard']);
        return of(null);
      })
    );
  }

  /** Creates the payment controls and recalculates the total whenever the discount changes. */
  private initFormControl() {
    this.paymentForm = this.fb.group({
      discount: [null, [Validators.min(0), Validators.max(99)]],
      cash: [null, [Validators.required, this.cashEnoughValidator(this.finalTotal)]]
    });

    this.paymentForm.get('discount')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      const discountControl = this.paymentForm.get('discount');
      const discountValue = value === null || value === '' ? 0 : Number(value);
      this.finalTotal = discountControl?.valid && Number.isFinite(discountValue)
        ? this.calculateTotalWithDiscount(discountValue)
        : this.totalAmount;
      this.updateCashValidator();
    });
  }

  /** Validates and submits the payment, then shows the change due before navigating away. */
  onPay() {
    const order = this.order;
    if (!order?.id || this.isLoading) {
      return;
    }

    if (this.paymentForm.valid) {
      const discount = Number(this.paymentForm.get('discount')?.value ?? 0);
      const cash = Number(this.paymentForm.get('cash')?.value);
      this.isLoading = true;
      this.orderService.pay(order, discount, cash).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.confirmCashBack().then(() => this.router.navigate(['dashboard']));
        },
        error: err => {
          this.isLoading = false;
          this.toastService.show(this.errorHandler.parseError(err), 3000, 'error');
        }
      });
    }
    else {
      this.paymentForm.markAllAsTouched();
    }
  }

  /** Returns to the dashboard without submitting the payment. */
  cancel() {
    this.router.navigate(['dashboard']);
  }

  /** Calculates the payable amount after applying a percentage discount, rounded to cents. */
  private calculateTotalWithDiscount(discount: number): number {
    return Math.round((this.totalAmount - (this.totalAmount * (discount / 100))) * 100) / 100;
  }

  /** Ensures the entered cash is a finite amount at least equal to the amount due. */
  cashEnoughValidator(minAmount: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value === null || control.value === '') {
        return null;
      }
      const value = Number(control.value);
      if (!Number.isFinite(value)) {
        return { invalidCash: true };
      }
      return value < minAmount ? { notEnoughCash: true } : null;
    };
  }

  /** Refreshes the cash validator whenever the final payment total changes. */
  updateCashValidator() {
    this.paymentForm.get('cash')?.setValidators([
      Validators.required,
      this.cashEnoughValidator(this.finalTotal)
    ]);
    this.paymentForm.get('cash')?.updateValueAndValidity({emitEvent: false});
  }

  /** Opens the confirmation dialog showing the formatted change due to the customer. */
  async confirmCashBack() {
    const cashBack = Number(this.paymentForm.get('cash')?.value) - this.finalTotal;
    const cashBackFormated = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cashBack);
    const message = await firstValueFrom(this.translate.get('PAGES_B.PAY.CHANGE', {amount: cashBackFormated}));
    await this.confirmModal.open(message);
  }

  /** Parses a route parameter as a positive, safe integer ID. */
  private parsePositiveId(value: string): number | null {
    if (!/^\d+$/.test(value)) {
      return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
  }
}
