import {Component, OnInit, output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Customer} from '../../models/customer';
import {CustomerService} from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss'
})
export class CustomerFormComponent implements OnInit {

  customerForm!: FormGroup;
  onSaveCustomer = output<Customer>();


  /**
   *
   * @param fb
   * @param customerService
   */
  constructor(private fb: FormBuilder, private customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
    });
  }

  /**
   *
   */
  onCustomerSave(){
    if (this.customerForm.valid) {
      const customer: Customer = this.customerForm.value;
      this.onSaveCustomer.emit(customer);
    } else {
      this.customerForm.markAllAsTouched();
    }
  }


  /**
   *
   */
  onPhoneBlur(): void {
    const phoneControl = this.customerForm.get('phone');
    if (phoneControl?.valid) {
      const phoneValue = phoneControl.value;
      this.searchCustomerByPhone(phoneValue);
    }
  }

  /**
   *
   * @param phone
   */
  searchCustomerByPhone(phone: string): void {
    this.customerService.findByPhone(phone).subscribe({
      next: customer => {
        this.populateForm(customer);
      }
    })
  }


  /**
   *
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
   *
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
   *
   * @param event
   */
  sanitizePhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanValue = input.value.replace(/\D/g, '').slice(0, 10); // Strip non-digits, max 10
    this.customerForm.get('phone')?.setValue(cleanValue, { emitEvent: false });
  }
}
