import {Component, input} from '@angular/core';
import {Table} from '../../../models/table';

@Component({
  selector: 'app-table-selector-item',
  imports: [],
  templateUrl: './table-selector-item.component.html',
  styleUrl: './table-selector-item.component.scss'
})
export class TableSelectorItemComponent{

  table = input.required<Table>();

}
