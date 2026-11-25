import {Component, input, OnInit, output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Customer} from '../../models/customer';
import {CustomerService} from '../../services/customer.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-customer-form',
  imports: [
    ReactiveFormsModule,
    TranslatePipe
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {

  customerForm!: FormGroup;
  customer = input.required<Customer>()


  /**
   *
   * @param fb
   * @param customerService
   */
  constructor(private fb: FormBuilder, private customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      id: [this.customer()?.id],
      firstName: [this.customer()?.firstName, Validators.required],
      lastName: [this.customer()?.lastName, Validators.required],
      address: [this.customer()?.address, Validators.required],
      phone: [this.customer()?.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });

    // Subscribe to form status changes to update the validity in the service
    this.customerForm.statusChanges.subscribe(() => {
      this.syncFormState();
    });
  }

  private syncFormState(): void {
    const valid = this.customerForm.valid;
    this.customerService.setCustomerFormState(
      valid,
      valid ? this.customerForm.getRawValue() : null
    );
  }

  /**
   * Handle the phone input blur event
   */
  onPhoneBlur(): void {
    const phoneControl = this.customerForm.get('phone');
    if (phoneControl?.valid) {
      const phoneValue = phoneControl.value;
      this.searchCustomerByPhone(phoneValue);
    }
  }

  /**
   * Search for a customer by phone number
   * @param phone
   */
  searchCustomerByPhone(phone: string): void {
    this.customerService.findByPhone(phone).subscribe({
      next: customer => {
        this.populateForm(customer);
        this.syncFormState();
      }
    })
  }


  /**
   * Populate the form with customer data
   * @param customer
   */
  populateForm(customer: Customer): void {
    this.customerForm.patchValue({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: customer.address
    });
  }

  /**
   * Allow only numeric input
   * @param event
   */
  allowOnlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    const isDigit = /^\d$/.test(event.key);

    if (!isDigit && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }

    // Prevent typing more than 10 digits
    const input = event.target as HTMLInputElement;
    if (isDigit && input.value.length >= 10) {
      event.preventDefault();
    }
  }

  /**
   * Sanitize the phone input by allowing only numeric characters and limiting to 10 digits
   * @param event
   */
  sanitizePhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replace(/\D/g, '').slice(0, 10); // Strip non-digits, max 10
    this.customerForm.get('phone')?.setValue(cleanValue, { emitEvent: false });
  }
}
