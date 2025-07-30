import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {FormsModule} from '@angular/forms';
import {NgbDateStruct, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from '../../services/toast.service';
import {DatePipe} from '@angular/common';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {ReportService} from '../../services/report.service';
import {ChartData, ChartOptions} from 'chart.js';
import {BaseChartDirective} from 'ng2-charts';

@Component({
  selector: 'app-reports-page',
  imports: [
    HeaderComponent,
    FormsModule,
    NgbInputDatepicker,
    BaseChartDirective,
  ],
  providers: [DatePipe],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.scss'
})
export class ReportsPage implements OnInit {

  @ViewChild('salesChart', { static: false, read: BaseChartDirective }) salesChart?: BaseChartDirective;
  @ViewChild('mostSoldProductsChart', { static: false, read: BaseChartDirective }) mostSoldProductsChart?: BaseChartDirective;

  initDate: NgbDateStruct | null = null;
  endDate: NgbDateStruct | null = null;



  /**
   *
   * @param toastService
   * @param reportService
   * @param datePipe
   * @param errorHandler
   */
  constructor(private toastService: ToastService,
              private reportService: ReportService,
              private datePipe: DatePipe,
              private errorHandler: ErrorHandlerService,) {

  }


  /**
   * Chart for sales by day
   */
  salesChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Ventas por Fecha' },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 90 //rotate labels 90 degrees
        }
      }
    }
  };

  salesChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        type: 'line',
        label: 'Ventas ($)',
        data: [],
        borderColor: 'rgb(141,190,229)',
        backgroundColor: '#14578c',
        tension: 0.7
      },
    ],
  };

  /**
   * Chart for most sold product
   */
  mostProductsSoldChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Productos más Vendidos' },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12
          },
          maxRotation: 90 //rotate labels 90 degrees
        }
      }
    }
  };

  mostProductsSoldChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        type: 'bar',
        label: 'Unidades Vendidas',
        data: [],
        borderColor: 'rgb(141,190,229)',
        backgroundColor: '#14578c'
      },
    ],
  };


  /**
   *
   */
  ngOnInit(): void {
    const initDate = new Date();
    const endDate = new Date();
    initDate.setDate(initDate.getDate() - 30);
    this.initDate = {year: initDate.getFullYear(), month: initDate.getMonth() + 1, day: initDate.getDate()};
    this.endDate = {year: endDate.getFullYear(), month: endDate.getMonth() + 1, day: endDate.getDate()};
    const initDateString = this.createDateString(initDate.getFullYear(), initDate.getMonth(), initDate.getDate())
    const endDateString = this.createDateString(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
    this.searchSalesByDay(initDateString, endDateString);
    this.searchMostSoldProducts(initDateString, endDateString);
  }


  /**
   *
   */
  onSearch() {
    if (this.initDate === null || this.endDate === null) {
      this.toastService.show("Selecciones Fechas", 2000, "warning");
      return;
    }

    const initDate = new Date(this.initDate.year, this.initDate.month - 1, this.initDate.day);
    const endDate = new Date(this.endDate.year, this.endDate.month - 1, this.endDate.day);

    if (initDate > endDate) {
      this.toastService.show("Fechas Incorrectas", 2000, "error");
      return
    }

    const initDateString = this.datePipe.transform(initDate, 'yyyy-MM-dd');
    const endDateString = this.datePipe.transform(endDate, 'yyyy-MM-dd');

    this.searchSalesByDay(initDateString ?? "", endDateString ?? "");
    this.searchMostSoldProducts(initDateString ?? "", endDateString ?? "");

  }

  /**
   *
   * @param initDate
   * @param endDate
   */
  searchMostSoldProducts(initDate: string, endDate: string) {
    this.reportService.findMostSoldProducts(initDate, endDate).subscribe({
      next: response => {
        const labels = response.map((item) => item.productName);
        const data = response.map((item) => item.totalQuantity);
        this.mostProductsSoldChartData.labels = labels;
        this.mostProductsSoldChartData.datasets[0].data = data;
        this.mostSoldProductsChart?.update();
      },
      error: err => {
        console.error(this.errorHandler.parseError(err));
      }
    });
  }

  /**
   *
   * @param initDate
   * @param endDate
   */
  searchSalesByDay(initDate: string, endDate: string) {
    this.reportService.findSales(initDate, endDate).subscribe({
      next: response => {
        const labels = response.map((item) => this.createDateString(item.year, item.month, item.day));
        const data = response.map((item) => item.totalSales);
        this.salesChartData.labels = labels;
        this.salesChartData.datasets[0].data = data;
        this.salesChart?.update()
      },
      error: err => {
        console.error(this.errorHandler.parseError(err));
      }
    });
  }

  /**
   *
   * @param year
   * @param month
   * @param day
   * @private
   */
  private createDateString( year: number, month: number, day: number) : string {
    const createdDate = new Date(year, month, day);
    return this.datePipe.transform(createdDate, 'yyyy-MM-dd') ?? "";
  }

}
