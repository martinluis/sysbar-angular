import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-info-modal',
  imports: [],
  templateUrl: './info.modal.html',
  styleUrl: './info.modal.scss'
})
export class InfoModal {

  message = 'Default modal message';
  show = false;
  @Input() timer = 0

  /**
   *
   */
  onClose(): void {
    this.show = false;
  }


  /**
   *
   * @param message
   */
  open(message: string) {
    this.message = message;
    this.show = true;
    if (this.timer > 0) {
      setTimeout(() => {
        this.onClose();
      }, this.timer);
    }
  }


}
