import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {TableSelectorComponent} from '../../components/table-selector/table-selector.component';
import {Router} from '@angular/router';
import {OrderType} from '../../models/order-type.enum';

@Component({
  selector: 'app-waiter-dashboard-page',
  imports: [
    HeaderComponent,
    TableSelectorComponent
  ],
  templateUrl: './waiter-dashboard.page.html',
  styleUrl: './waiter-dashboard.page.scss'
})
export class WaiterDashboardPage {


  /**
   *
   * @param router
   */
  constructor(private router:Router) {
  }

  /**
   *
   */
  createDeliveryOrder(){
    this.router.navigate(['waiter/order'], {
      queryParams: { orderType: OrderType.DELIVERY }
    })
  }
}
