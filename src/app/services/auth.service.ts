import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { UserInterface } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenKey = 'access_token';
  private refreshTokenKey = 'refresh_token';
  private user = 'user';

  constructor(private http: HttpClient, private cookieService: CookieService) { }
  
  urlLogin = 'http://localhost:8000/api/auth/login';
  urlRegister = 'http://localhost:8000/api/users/register';
  urlLogout = 'http://localhost:8000/api/auth/logout';
  
  login(user: any): Observable<any> {
    localStorage.setItem(this.user, JSON.stringify(user));
    return this.http.post(this.urlLogin, user);
  }

  register(user: UserInterface): Observable<any> {
    return this.http.post(this.urlRegister, user);
  }

  saveTokens(accessToken: string, refreshToken: string) {
    this.cookieService.set(this.accessTokenKey, accessToken, undefined, '/', undefined, true, 'Strict');
    this.cookieService.set(this.refreshTokenKey, refreshToken, undefined, '/', undefined, true, 'Strict');
  }

  getAccessToken(): string | null {
    return this.cookieService.get(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return this.cookieService.get(this.refreshTokenKey);
  }

  clearTokens() {
    this.cookieService.delete(this.accessTokenKey, '/');
    this.cookieService.delete(this.refreshTokenKey, '/');
  }

  logout() {
    const accessToken = this.cookieService.get(this.accessTokenKey);

    this.clearTokens();

    if (accessToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });
      return this.http.get(this.urlLogout, { headers });
    } else {
      return throwError(() => new Error('No se encontró el token de acceso'));
    }
  }
}