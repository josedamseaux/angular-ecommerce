import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly http: HttpClient, private authService: AuthService) { }

  private apiUrl = 'http://localhost:8000/api/users';

  getUsers(page: number) {
    const accessToken = this.authService.getRefreshToken();
    if (accessToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });
      return this.http.get(`${this.apiUrl}/all?page=${page}&limit=5`, { headers });
    }
    return of(null);
  }

  findUserAndPurchases(username: string){
    console.log(username)
    const accessToken = this.authService.getRefreshToken();
    if (accessToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });
      return this.http.get(`${this.apiUrl}/${username}`, { headers });
    }
    return of(null);
  }
}