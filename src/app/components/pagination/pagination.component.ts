import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {

  // inputs (signals or plain values depending on your setup)
  page = input.required<number>();
  totalPages = input.required<number>();

  // outputs
  pageChange = output<number>();
  pageSizeChange = output<number>();

  /**
   *
   */
  prev() {
    if (this.page() > 1) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  /**
   *
   */
  next() {
    if (this.page() < this.totalPages()) {
      this.pageChange.emit(this.page() + 1);
    }
  }

  /**
   *
   * @param size
   */
  changePageSize(size: number) {
    this.pageSizeChange.emit(size);
  }
}
