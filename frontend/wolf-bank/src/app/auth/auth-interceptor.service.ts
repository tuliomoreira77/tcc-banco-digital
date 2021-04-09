import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse
  } from '@angular/common/http';
  import { Inject, Injectable } from '@angular/core';
  import { AuthServiceService } from './auth-service.service';
  import { catchError } from 'rxjs/operators';
  import { throwError, EMPTY } from 'rxjs';
  import { Router } from '@angular/router';
  
  @Injectable()
  export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthServiceService, private router: Router) {}
  
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      if(this.authService.verifyExistentToken()) {
        const token = this.authService.getCookie('token');
        const authReq = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`
          }
        });
        return next.handle(authReq).pipe(
          catchError(error => {
            return this.handleErrors(error);
          })
        );
      }
      return next.handle(req).pipe(
        catchError(error => {
          return this.handleErrors(error);
      }));
    }
  
    handleErrors(error) {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigateByUrl('/login');
        } else if (error.status === 403) {
          this.router.navigateByUrl('/proibido');
        }
        return throwError(error);
      }
    }
  
  }