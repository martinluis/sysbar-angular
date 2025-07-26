import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {OrderService} from '../../services/order.service';
import {Observable} from 'rxjs';
import {Order} from '../../models/order';
import {AsyncPipe, CurrencyPipe, DatePipe} from '@angular/common';
import {OrderType} from '../../models/order-type.enum';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {Role} from '../../models/role.enum';

@Component({
  selector: 'app-cashier-page',
  imports: [
    HeaderComponent,
    AsyncPipe,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './cashier-page.html',
  styleUrl: './cashier-page.scss'
})
export class CashierPage implements OnInit{


  orders$!: Observable<Order[]>;
  orderSelected!: Order

  constructor(private orderServices: OrderService,
              private router: Router,
              private authService: AuthService) {
  }

  /**
   *
   */
  ngOnInit(): void {
     this.orders$ = this.orderServices.getAllActives();
  }

  /**
   *
   * @param order
   */
  onSelectOrder(order: Order) {
    this.orderSelected = order;
  }

  /**
   *
   */
  onPay() {
    this.router.navigate(['pay'], {
      queryParams: { orderId: this.orderSelected.id }
    })
  }


  /**
   *
   */
  onPartialPay() {
    this.router.navigate(['partial-pay'], {
      queryParams: { orderId: this.orderSelected.id }
    })
  }

  /**
   *
   */
  onUpdateOrder() {
    this.router.navigate(['order'], {
      queryParams: { orderId: this.orderSelected.id }
    })
  }

  /**
   *
   * @param order
   */
  getTypeDescription(order: Order): string {
      switch (order.orderType) {
        case OrderType.PERSONAL:
          return `Personal - ${order.reference}`;
        case OrderType.LOCAL:
          return order.table?.name ?? "Mesa";
        case OrderType.DELIVERY:
          return "A domicilio";
      }
  }


  /**
   *
   */
  hasPermissions(roles: Role[]): boolean {
    return this.authService.hasAnyRole(roles);
  }


  protected readonly OrderType = OrderType;
  protected readonly Role = Role;
}
