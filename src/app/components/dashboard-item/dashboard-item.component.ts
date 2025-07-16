import {Component, input, OnInit} from '@angular/core';
import {AppSection} from '../../config/app.config';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard-item',
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard-item.component.html',
  styleUrl: './dashboard-item.component.scss'
})
export class DashboardItemComponent implements OnInit {

  section = input.required<AppSection>();


  /**
   *
   */
  ngOnInit(): void {
    console.log(this.section());
  }



}
