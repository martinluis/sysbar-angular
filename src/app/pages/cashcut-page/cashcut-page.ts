import {Component, OnInit, signal} from '@angular/core';
import {CurrencyPipe, DatePipe} from "@angular/common";
import {HeaderComponent} from "../../components/header/header.component";
import {ErrorHandlerService} from '../../services/error-handler.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Cashcut} from '../../models/cashcut';
import {CashcutService} from '../../services/cashcut.service';
import {ToastService} from '../../services/toast.service';
import {Router, RouterLink} from '@angular/router';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cashcut-page',
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    CurrencyPipe,
    DatePipe,
    RouterLink,
    NgbInputDatepicker,
    FormsModule
  ],
  providers: [DatePipe],
  templateUrl: './cashcut-page.html',
  styleUrl: './cashcut-page.scss'
})
export class CashcutPage implements OnInit{

  cashcuts = signal<Cashcut[]>([])
  cashcutActive = signal<Cashcut|null>(null);
  cashcutForm!: FormGroup;
  isLoading = false;
  initDate: { year: number, month: number, day: number} | null = null;
  endDate: { year: number, month: number, day: number} | null = null;


  /**
   *
   * @param toastService
   * @param router
   * @param formBuilder
   * @param cashcutService
   * @param datePipe
   * @param errorHandler
   */
  constructor(private toastService: ToastService,
              private router: Router,
              private formBuilder: FormBuilder,
              private cashcutService: CashcutService,
              private datePipe: DatePipe,
              private errorHandler: ErrorHandlerService,) {
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

    this.cashcutService.getAll().subscribe({
      next: cashcuts => {
        this.cashcuts.set(cashcuts);
      },
      error: err => {
        console.error(this.errorHandler.parseError(err));
      }
    })

    this.initFormGroup();
  }

  /**
   *
   */
  initFormGroup() {
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
        this.cashcuts.set([...this.cashcuts(), cashcut]);
        this.cashcutForm.reset();
        this.toastService.show('Se genero el corte', 2000, "success");
        this.cashcutService.getActive().subscribe({
          next: cashcut => {
            this.cashcutActive.set(cashcut);
          },
          error: err => {
            console.error(this.errorHandler.parseError(err));
          }
        })
      },
      error: err => {
        this.toastService.show('Error al crear el corte de caja', 2000, "error");
        console.error(this.errorHandler.parseError(err));
      }
    })
  }

  /**
   *
   */
  onSearch() {
    if (this.initDate === null || this.endDate === null) {
      this.toastService.show("Selecciones Fechas de Busqueda", 2000, "warning");
      return;
    }
    const initDate = new Date(this.initDate.year, this.initDate.month - 1, this.initDate.day);
    const initDateString = this.datePipe.transform(initDate, 'yyyy-MM-dd');
    const endDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);
    const endDateString = this.datePipe.transform(endDate, 'yyyy-MM-dd');
    if (initDate > endDate) {
      this.toastService.show("Fechas Incorrectas", 2000, "error");
      return
    }
    this.cashcutService.getAll(initDateString ?? "", endDateString ?? "").subscribe({
      next: cashcuts => {
        this.cashcuts.set(cashcuts);
      },
      error: err => {
        console.error(this.errorHandler.parseError(err));
      }
    })
  }

  /**
   *
   */
  onCancel(){
    this.router.navigate(['admin']);
  }


}
