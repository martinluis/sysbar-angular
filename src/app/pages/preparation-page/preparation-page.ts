import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {DatePipe} from '@angular/common';
import {OrderType} from '../../models/order-type.enum';
import {PreparationItem} from '../../models/preparation-item';
import {PreparationService} from '../../services/preparation.service';
import {ErrorHandlerService} from '../../services/error-handler.service';

import {Preparation} from '../../models/preparation';

@Component({
  selector: 'app-cashier-page',
  imports: [
    HeaderComponent,
    DatePipe,
  ],
  templateUrl: './preparation-page.html',
  styleUrl: './preparation-page.scss'
})
export class PreparationPage implements OnInit{


  orders: Preparation[] = [];
  orderSelected!: Preparation

  constructor(private preparationService: PreparationService,
              private errorHandler: ErrorHandlerService, ) {
  }

  /**
   *
   */
  ngOnInit(): void {
     this.preparationService.findActive().subscribe({
       next: items => {
         this.orders = this.generatePreparationOrder(items);
       },
       error: err => {
         console.log(this.errorHandler.parseError(err));
       }
     })
  }

  /**
   *
   * @param order
   */
  onSelectOrder(order: Preparation) {
    this.orderSelected = order;
  }

  /**
   *
   */
  onCompleteItem(itemId: number) {
    this.preparationService.finish(itemId).subscribe({
      next: value => {
        this.orderSelected.items = this.orderSelected.items.filter(it => it.id !== itemId);
        if (this.orderSelected.items.length === 0) {
          console.log(this.orderSelected.items.length);
          this.orders = this.orders.filter(or => or.id !== this.orderSelected.id)
        }
      },
      error: err => {
        console.log(this.errorHandler.parseError(err));
      }
    })

  }

  /**
   *
   * @param items
   * @private
   */
  private generatePreparationOrder(items: PreparationItem[]): Preparation[]{
    let orders: Preparation[] = [];
    const grouped = items.reduce((acc, item) => {
      const key = item.orderId;

      if (!acc.has(key) ) {
        acc.set(key, []);
      }

      const value = acc.get(key)!;
      value.push(item);
      acc.set(key, value)

      return acc;
    }, new Map<number, PreparationItem[]>);

    for (const key of grouped.keys()) {
      orders.push( this.createOrderFromItems(grouped.get(key)!) )
    }
    return orders;
  }

  /**
   *
   * @param preparationItems
   * @private
   */
  private createOrderFromItems(preparationItems: PreparationItem[]): Preparation {
    const item = preparationItems[0];
    return {
      id: item.orderId,
      createdAt: item.createdAt,
      customer: item.customer,
      items: preparationItems,
      orderType: item.orderType,
      reference: item.reference,
      tableName: item.tableName,
      userName: item.userName
    };
  }


  /**
   *
   * @param order
   */
  getTypeDescription(order: Preparation): string {
      switch (order.orderType) {
        case OrderType.PERSONAL:
          return "Personal";
        case OrderType.LOCAL:
          return order.tableName;
        case OrderType.DELIVERY:
          return "A domicilio";
      }
  }


  protected readonly OrderType = OrderType;
}
