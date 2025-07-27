import {Component, signal} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20%)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20%)' }))
      ])
    ])
  ]
})
export class Toast {

  message = signal<string>('');
  visible = signal(false);
  style = signal<string>("")

  show(msg: string, duration = 3000, style = "") {
    this.message.set(msg);
    this.visible.set(true);
    this.style.set(style);
    setTimeout(() => this.visible.set(false), duration);
  }

}
