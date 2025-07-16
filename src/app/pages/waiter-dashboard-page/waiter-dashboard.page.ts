import { Component } from '@angular/core';
import {HeaderComponent} from '../../components/header/header.component';
import {TableSelectorComponent} from '../../components/table-selector/table-selector.component';

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

}
