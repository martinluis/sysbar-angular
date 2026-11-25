import {Component, OnInit, output, ChangeDetectionStrategy} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TableService} from '../../services/table.service';
import {Observable} from 'rxjs';
import {Table} from '../../models/table';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-move-table-modal',
  imports: [
    AsyncPipe,
    TranslatePipe
  ],
  templateUrl: './move-table.modal.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './move-table.modal.scss'
})
export class MoveTableModal implements OnInit{

  tables$!: Observable<Table[]>;
  show = false;
  selectedTableId = 0;
  onConfirmChangeTable = output<number>()

  /**
   *
   * @param tableService
   */
  constructor(private tableService: TableService) {

  }

  /**
   *
   */
  ngOnInit(): void {
    this.tables$ = this.tableService.getAll();
    this.selectedTableId = 0;
  }

  /**
   *
   */
  onClose(): void {
    this.selectedTableId = 0;
    this.show = false;
  }


  /**
   *
   * @param message
   * @param timer
   */
  open() {
    this.show = true;
  }


  /**
   *
   * @param tableId
   */
  onSelectTable(tableId: number){
    this.selectedTableId = tableId
  }

  /**
   *
   */
  onConfirm(){
    if (this.selectedTableId == 0) {
      return
    }
    this.onConfirmChangeTable.emit(this.selectedTableId)
    this.onClose();
  }

}
