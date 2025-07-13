import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AppProperties} from '../config/app.properties';

// This is a functional interceptor using Angular 15+ syntax
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const apiKey = AppProperties['apiKey']
  const authReq = req.clone({
    setHeaders: {
      'API-Key': `${apiKey}`
    }
  });
  return next(authReq);
};
