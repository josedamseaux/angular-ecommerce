import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

    // Método para realizar solicitudes GET a la API protegida 'REFRESH'
    getMethod(route: any): Observable<any> {
      const refreshToken = this.authService.getRefreshToken();
      console.log(refreshToken)
      if (refreshToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${refreshToken}`
        });
        return this.http.get(`${this.apiUrl}/${route}`, { headers }).pipe(
          tap((data: any) => {
            console.log('acaaa' + data)
            if (data.accessToken && data.refreshToken) {
              this.authService.saveTokens(data.accessToken, data.refreshToken);
            }
          })
        );
      } else {
        return throwError(() => new Error('No se encontró el token de acceso'));
      }
    }



  }