import {Injectable} from '@angular/core';
import {AppProperties} from '../config/app.properties';
import {HttpClient, HttpParams} from '@angular/common/http';
import {concat, Observable} from 'rxjs';
import {Order} from '../models/order';
import {OrderType} from '../models/order-type.enum';
import {OrderStatus} from '../models/order-status.enum';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = AppProperties['apiUrl'] + '/order/';

  constructor(private http: HttpClient) {}


  /**
   *
   */
  get(id: number): Observable<Order> {
    return this.http.get<Order>(this.apiUrl.concat(`${id}`));
  }

  /**
   *
   */
  getByTable(tableId: number): Observable<Order> {
    let params = new HttpParams();
    params = params.set('tableId', tableId);
    return this.http.get<Order>(this.apiUrl.concat("findByTable"), {params});
  }

  /**
   *
   * @param order
   */
  update(order: Order): Observable<Order> {
    const url = `${this.apiUrl}${order.id}`
    return this.http.put<Order>(url, order);
  }

  /**
   *
   * @param type
   * @param status
   */
  getByTypeAndStatus(type: OrderType, status: OrderStatus): Observable<Order[]> {
    let params = new HttpParams();
    params = params.set('type', type);
    params = params.set('status', status);
    return this.http.get<Order[]>(this.apiUrl.concat("findByTypeAndStatus"), {params});
  }


  /**
   *
   * @param order
   */
  confirm(order: Order): Observable<Order> {
    if (!order.id) {
      return this.create(order)
    }
    const observables = [];
    if (order.items.some(it => it.itemId && it.isUpdated) ){
      observables.push( this.updateItems(order) );
    }
    if (order.items.some(it => it.itemId && it.isDeleted) ){
      observables.push( this.deleteItems(order) );
    }
    if (order.items.some(it => it.itemId===null) ){
      observables.push( this.addItems(order) );
    }

    return concat(...observables);
  }

  /**
   *
   * @param order
   */
  create(order: Order): Observable<Order> {
   switch (order.orderType) {
     case OrderType.LOCAL:
       return this.createToTable(order);
     case OrderType.DELIVERY:
       return this.createToDelivery(order);
     case OrderType.PERSONAL:
       return this.createToPersonal(order);
   }
  }


  pay(order: Order, discount: number, cash: number): Observable<Order> {
    return this.http.post<Order>(this.apiUrl.concat(order.id!.toString()).concat("/pay"), {
      "amount": cash,
      "discount": discount
    });
  }

  /**
   *
   * @param order
   * @private
   */
  private createToTable(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  /**
   *
   * @param order
   * @private
   */
  private createToDelivery(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl.concat("delivery"), order);
  }
  /**
   *
   * @param order
   * @private
   */
  private createToPersonal(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl.concat("personal"), order);
  }

  /**
   *
   * @param order
   */
  addItems(order: Order) {
    const url = `${this.apiUrl}${order.id}/addItems`
    const items = order.items.filter(it => it.itemId===null);
    return this.http.post<Order>(url, items);
  }

  /**
   *
   * @param order
   */
  deleteItems(order: Order) {
    const url = `${this.apiUrl}${order.id}/deleteItems`
    let params = new HttpParams();
    order.items.forEach(it => {
      if (it.itemId && it.isDeleted) {
        params = params.append('itemIds', it.itemId?.toString());
      }
    });
    return this.http.delete<Order>(url, { params } );
  }

  /**
   *
   * @param order
   */
  updateItems(order: Order, ) {
    const url = `${this.apiUrl}${order.id}/updateItems`
    let params: {itemId: number, quantity: number}[] = [];
    order.items.forEach(it => {
      if (it.itemId && it.isUpdated) {
        params.push({itemId: it.itemId, quantity: it.quantity})
      }
    });
    return this.http.put<Order>(url,  params);
  }

  /**
   *
   * @param order
   * @param newTableId
   */
  changeTable(order: Order, newTableId: number): Observable<Order> {
    const url = `${this.apiUrl}${order.id}/changeTable`
    return this.http.patch<Order>(url,  {
      id: newTableId
    });
  }
}
