import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AppProperties} from '../config/app.properties';
import {AuthService} from './auth.service';
import {inject} from '@angular/core';

// This is a functional interceptor using Angular 15+ syntax
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getUserToken();
  const apiKey = AppProperties['apiKey']

  let headers: Record<string, string> = {
    'API-Key': apiKey
  };
  const url = new URL(req.url);
  if (url.pathname.startsWith('/sysbar/api/') && token) {
    headers = {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }

  const authReq = req.clone({
    setHeaders: headers
  });

  return next(authReq);
};
