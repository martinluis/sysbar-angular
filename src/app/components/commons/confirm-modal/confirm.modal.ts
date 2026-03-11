import {Component, input, signal} from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm.modal.html',
  styleUrl: './confirm.modal.scss'
})
export class ConfirmModal {

  showCancelButton = input<boolean>(false)

  message = '';
  show = false;

  private _resolve!: (result: boolean) => void;

  open(message: string): Promise<boolean> {
    this.message = message;
    this.show = true;

    return new Promise<boolean>((resolve) => {
      this._resolve = resolve;
    });
  }

  confirm(result: boolean) {
    this.show = false;
    this._resolve(result);
  }

}
