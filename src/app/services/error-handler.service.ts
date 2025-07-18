import { Injectable } from '@angular/core';
import {ErrorResponse} from '../models/error-response';
import {AppLabels} from '../config/app.labels';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  /**
   *
   * @param err
   */
  parseError(err: any): string {
    let errorMsg = 'An unexpected error occurred.';

    const error: ErrorResponse = err?.error;

    if (error?.errorCodes?.[0]) {
      errorMsg = AppLabels[error.errorCodes[0]] ?? error.message ?? errorMsg;
    } else if (error?.message) {
      errorMsg = error.message;
    } else if (err?.message) {
      errorMsg = this.errorMessageHandler(err.message);
    }
    return errorMsg;
  }


  /**
   *
   * @param err
   */
  getErrorCode(err: any): string {
    let errorCode = '';
    const error: ErrorResponse = err?.error;

    if (error?.errorCodes?.[0]) {
      errorCode = error.errorCodes[0];
    } else if (error?.status) {
      errorCode = error.status + "";
    } else if (err?.status) {
      errorCode = err?.status;
    }
    return errorCode;
  }

  private errorMessageHandler(message: string): string {
    if (message && message.toLowerCase().includes("http failure response for http")) {
      return AppLabels["service.connection.error"];
    }
    return message;
  }
}
