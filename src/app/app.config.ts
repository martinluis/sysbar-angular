
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';

import {
  provideTranslateService
} from '@ngx-translate/core';

import {
  provideTranslateHttpLoader
} from '@ngx-translate/http-loader';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { authInterceptor } from './services/auth-interceptor.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideZoneChangeDetection({
      eventCoalescing: true
    }),

    provideRouter(routes),

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    provideAnimations(),

    provideCharts(withDefaultRegisterables()),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'es',
      lang: 'es'
    })
  ]
};
