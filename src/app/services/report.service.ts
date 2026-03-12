import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ReportSoldProduct} from '../models/report-sold-product';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
import {ReportSale} from '../models/report-sale';

@Injectable({
  providedIn: 'root'
})
export class ReportService {


  private apiUrl = environment.apiUrl + '/report/';

  constructor(private http: HttpClient) {}

  /**
   *
   */
  findMostSoldProducts(startDate = "", endDate = ""): Observable<ReportSoldProduct[]> {
    const url = this.apiUrl.concat("products/most-sold")
    if (startDate !== "" && endDate !== "") {
      let params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);
      return this.http.get<ReportSoldProduct[]>(url, { params });
    }
    return this.http.get<ReportSoldProduct[]>(url);
  }


  /**
   *
   * @param startDate
   * @param endDate
   */
  findSales(startDate = "", endDate = ""): Observable<ReportSale[]> {
    const url = this.apiUrl.concat("sales")
    if (startDate !== "" && endDate !== "") {
      let params = new HttpParams()
        .set('startDate', startDate)
        .set('endDate', endDate);
      return this.http.get<ReportSale[]>(url, { params });
    }
    return this.http.get<ReportSale[]>(url);
  }

}
