import {Component, input} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {AppSection} from '../../config/app.config';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard-item',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './dashboard-item.component.html',
  styleUrl: './dashboard-item.component.scss'
})
export class DashboardItemComponent {

  section = input.required<AppSection>();


}
