import {Component, OnInit} from '@angular/core';
import {Order} from '../../models/order';
import {OrderService} from '../../services/order.service';
import {OrderType} from '../../models/order-type.enum';
import {OrderStatus} from '../../models/order-status.enum';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-personal-order-selector',
    imports: [
      TranslatePipe
    ],
  templateUrl: './personal-order-selector.component.html',
  styleUrl: './personal-order-selector.component.scss'
})
export class PersonalOrderSelectorComponent implements OnInit{

  orders!: Order[];


  constructor(private orderService: OrderService, private router: Router) {
  }


  /**
   *
   */
  ngOnInit(): void {
    this.orderService.getByTypeAndStatus(OrderType.PERSONAL, OrderStatus.ACTIVE).subscribe({
      next: orders => {
        this.orders = orders;
      },
      error: err => {
        console.log(err);
      }
    })
  }


  /**
   *
   * @param orderId
   */
  goToOrder(orderId: number){
    this.router.navigate(['order'], {
      queryParams: { orderId: orderId }
    })
  }
}
