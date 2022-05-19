import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthService } from "./_shared/services/auth.service";
import { TokenService } from "./_shared/services/token.service";
import * as config from 'src/assets/overrides.json';
import { ConnectionService } from "./_shared/services/connection.service";

const CONFIG_DATA = config;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    isOffline: boolean;

    constructor(
        private router: Router,
        private tokenService: TokenService,
        private authService: AuthService,
        private connectionService: ConnectionService,
        ) {
            this.isOffline = this.connectionService.isOffline;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): any {
        if (this.isOffline) {
            console.log('Offline request');
            return next.handle(request);
        }

        const token = this.tokenService.getToken();
        const refreshToken = this.tokenService.getRefreshToken();
    
        if (token) {
          request = request.clone({
            setHeaders: {
              Authorization: 'Bearer ' + token
            }
          });
        }
    
        if (!request.headers.has('Content-Type')) {
          request = request.clone({
            setHeaders: {
              'content-type': 'application/json'
            }
          });
        }
    
        request = request.clone({
          headers: request.headers.set('Accept', 'application/json')
        });
    
        return next.handle(request).pipe(
          map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              console.log('event--->>>', event);
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            console.log(error.error.error);
            if (error.status === 401) {
              if (error.error.error === 'invalid_token') {
                this.authService.refreshToken({refresh_token: refreshToken})
                  .subscribe(() => {
                    // location.reload(); // If needed
                    console.log('Token Refresh');
                  });
              } else {
                this.authService.login().subscribe(res => {
                    // location.reload(); // If needed
                    console.log('New Token');
                });
              }
            }
            return throwError(error);
          }));
      }

}