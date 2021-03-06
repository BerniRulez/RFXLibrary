import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RfxLoggerService } from './rfx-logger.service';

@Injectable()
export class RfxLoggerInterceptor implements HttpInterceptor {
  constructor(private rfxLoggerService: RfxLoggerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.rfxLoggerService.success(request.url, event);
        }
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          this.rfxLoggerService.error(request.url, error);
        }

        return throwError(error);
      })
    ) as Observable<HttpEvent<any>>;
  }
}
