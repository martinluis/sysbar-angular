import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {TableSelectorComponent} from '../../components/table-selector/table-selector.component';
import {Router} from '@angular/router';
import {OrderType} from '../../models/order-type.enum';
import {
  PersonalOrderSelectorComponent
} from '../../components/personal-order-selector/personal-order-selector.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-waiter-dashboard-page',
  imports: [
    HeaderComponent,
    TableSelectorComponent,
    PersonalOrderSelectorComponent,
    TranslatePipe
  ],
  templateUrl: './waiter.page.html',
  styleUrl: './waiter.page.scss'
})
export class WaiterPage {


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
    this.router.navigate(['order'], {
      queryParams: { orderType: OrderType.DELIVERY }
    })
  }

  /**
   *
   */
  createPersonalOrder(){
    this.router.navigate(['order'], {
      queryParams: { orderType: OrderType.PERSONAL }
    })
  }
}
