import {Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-info-modal',
  imports: [],
  templateUrl: './info.modal.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './info.modal.scss'
})
export class InfoModal {

  message = 'Default modal message';
  show = false;

  /**
   *
   */
  onClose(): void {
    this.show = false;
  }


  /**
   *
   * @param message
   * @param timer
   */
  open(message: string, timer: number | null) {
    this.message = message;
    this.show = true;
    if (timer && timer > 0) {
      setTimeout(() => {
        this.onClose();
      }, timer * 1000);
    }
  }


}
