import {ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable} from '@angular/core';
import {Toast} from '../components/commons/toast/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastRef: ComponentRef<Toast> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  show(message: string, durationMs = 3000, style = "") {
    if (!this.toastRef) {
      this.toastRef = createComponent(Toast, {
        environmentInjector: this.injector
      });

      this.appRef.attachView(this.toastRef.hostView);
      document.body.appendChild(this.toastRef.location.nativeElement);
    }

    this.toastRef.instance.show(message, durationMs, style);
  }

}
