import {Component, OnInit} from '@angular/core';
import {TableSelectorItemComponent} from './table-selector-item/table-selector-item.component';
import {TableService} from '../../services/table.service';
import {Observable} from 'rxjs';
import {Table} from '../../models/table';
import {AsyncPipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-table-selector',
  imports: [
    TableSelectorItemComponent,
    AsyncPipe
  ],
  templateUrl: './table-selector.component.html',
  styleUrl: './table-selector.component.scss'
})
export class TableSelectorComponent implements OnInit {

  tables$!: Observable<Table[]>;

  constructor(private tableService: TableService, private router: Router ) {
  }

  /**
   *
   */
  ngOnInit(): void {
    this.tables$ = this.tableService.getAll();
  }


  /**
   *
   * @param tableId
   * @param orderType
   */
  goToOrder(tableId: number){
    this.router.navigate(['waiter/order'], {
      queryParams: { tableId: tableId }
    })
  }

}
