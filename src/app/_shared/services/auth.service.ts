import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import * as config from 'src/assets/overrides.json';

const CONFIG_DATA = config;
const OAUTH_C = atob(CONFIG_DATA.clientAccess);
const OAUTH_S = atob(CONFIG_DATA.clientSec);
const API_URL = environment.tokenApi;
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl = '';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
    ) { }

  private static handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  private static log(message: string): any {
    console.log(message);
  }

  login(): Observable<any> {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    const body = new HttpParams()
      .set('username', CONFIG_DATA.pawwU)
      .set('password', atob(CONFIG_DATA.pawwP))
      .set('client_id', OAUTH_C)
      .set('client_secret', OAUTH_S)
      .set('grant_type', 'password');

    return this.http.post<any>(API_URL, body, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this.tokenService.saveToken(res.access_token);
          this.tokenService.saveRefreshToken(res.refresh_token);
        }),
        catchError(AuthService.handleError)
      );
  }

  refreshToken(refreshData: any): Observable<any> {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
    const body = new HttpParams()
      .set('refresh_token', refreshData.refresh_token)
      .set('grant_type', 'refresh_token');
    return this.http.post<any>(API_URL + 'oauth/token', body, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this.tokenService.saveToken(res.access_token);
          this.tokenService.saveRefreshToken(res.refresh_token);
        }),
        catchError(AuthService.handleError)
      );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.tokenService.removeRefreshToken();
  }

  secured(): Observable<any> {
    return this.http.get<any>(API_URL + 'secret')
      .pipe(catchError(AuthService.handleError));
  }
}
