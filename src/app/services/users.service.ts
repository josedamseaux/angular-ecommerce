import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'http://localhost:8000/api/users';

  getUsers(page: number) {
    const accessToken = this.authService.getRefreshToken();
    console.log(accessToken)
    if (accessToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });
      console.log(accessToken)
      return this.http.get(`${this.apiUrl}/all?page=${page}&limit=10`, { headers });
    }
    return of(null);
  }

  findUserAndPurchases(username: string): Observable<any>{
    console.log(username)
    const refreshToken = this.authService.getRefreshToken();
    console.log(refreshToken)
    if (refreshToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${refreshToken}`
      });

      console.log(headers)
      return this.http.get(`${this.apiUrl}/${username}`, { headers });
    }
    return of(null);
  }
}