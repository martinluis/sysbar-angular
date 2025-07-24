import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {DatePipe} from '@angular/common';
import {OrderType} from '../../models/order-type.enum';
import {PreparationItem} from '../../models/preparation-item';
import {PreparationService} from '../../services/preparation.service';
import {ErrorHandlerService} from '../../services/error-handler.service';

import {Preparation} from '../../models/preparation';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductType} from '../../models/product-type.enum';
import {AuthService} from '../../services/auth.service';
import {Role} from '../../models/role.enum';

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
  productType!: ProductType

  constructor(private preparationService: PreparationService,
              private errorHandler: ErrorHandlerService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const productType = params.get('type');
      this.productType = ProductType[productType as keyof typeof ProductType];
      this.validateRole();
      this.initView();
    });

  }

  /**
   *
   */
  initView(){
    this.preparationService.findActive().subscribe({
      next: items => {
        if (this.productType) {
          items = items.filter(it=> it.productType === this.productType)
        }
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
          this.orders = this.orders.filter(or => or.id !== this.orderSelected.id)
          if (this.orders.length > 0 ) {
            this.orderSelected = this.orders[0];
          }
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
   * @param productType
   * @private
   */
  private validateRole(){
    if (this.productType === ProductType.DRINK) {
      if (!this.authService.hasAnyRole([Role.ADMIN, Role.BARTENDER])){
          this.router.navigate(['access']);
          throw new Error('Unauthenticated');
      }
    }
    if (this.productType === ProductType.FOOD) {
      if (!this.authService.hasAnyRole([Role.ADMIN, Role.KITCHENER])){
        this.router.navigate(['access']);
        throw new Error('Unauthenticated');
      }
    }

    if (!this.productType) {
      if (!this.authService.hasAnyRole([Role.ADMIN, Role.KITCHENER, Role.BARTENDER])){
        this.router.navigate(['access']);
        throw new Error('Unauthenticated');
      }
    }
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
