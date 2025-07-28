import {Component, OnInit, signal} from '@angular/core';
import {CurrencyPipe, DatePipe} from "@angular/common";
import {HeaderComponent} from "../../components/header/header.component";
import {ErrorHandlerService} from '../../services/error-handler.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Cashcut} from '../../models/cashcut';
import {CashcutService} from '../../services/cashcut.service';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-cashcut-page',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './cashcut-page.html',
  styleUrl: './cashcut-page.scss'
})
export class CashcutPage implements OnInit{

  cashcuts: Cashcut[] = [];
  cashcutActive = signal<Cashcut | null>(null);
  cashcutSelected!: Cashcut;
  cashcutForm!: FormGroup;
  isLoading = false;


  constructor(private toastService: ToastService,
              private formBuilder: FormBuilder,
              private cashcutService: CashcutService,
              private errorHandler: ErrorHandlerService) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this.cashcutService.getActive().subscribe({
      next: cashcut => {
        this.cashcutActive.set(cashcut);
      },
      error: err => {
        console.error(this.errorHandler.parseError(err));
      }
    })
    this.cashcutForm = this.formBuilder.group({
      initialAmount: [null, [Validators.required, Validators.min(0)]]
    });
    this.cashcutForm.reset();
  }

  /**
   *
   */
  onCashCut(){
    const cashcut: Cashcut = this.cashcutForm.value;
    this.cashcutService.finish(cashcut).subscribe({
      next: cashcut => {
        this.cashcutActive.set(cashcut);
        this.cashcutForm.reset();
        this.toastService.show('Se genero el corte', 2000, "success");
      },
      error: err => {
        this.toastService.show('Error al crear el corte de caja', 2000, "error");
        console.error(this.errorHandler.parseError(err));
      }
    })
  }

  onCancel(){

  }


}
