import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, tap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { ProductInterface } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private apiUrl = 'http://localhost:8000/api/products'; // URL de tu backend de NestJS

  private productsSubject: BehaviorSubject<ProductInterface[]> = new BehaviorSubject<ProductInterface[]>([]);
  public products$: Observable<ProductInterface[]> = this.productsSubject.asObservable();
  private productChangedSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private authService: AuthService) { }

  // HTTP METHODS
  // Método GET para obtener productos desde el backend
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/all').pipe(
      tap((response: any) => {
        console.log(response)
        // Actualizar el valor del BehaviorSubject con los productos recibidos
        this.productsSubject.next(response.products);
      }))
  }

  // Metodo POST para que el admin añada @adminuser123456 productos
  addProduct(product: any, file: File): Observable<string> {
    const refreshToken = this.authService.getAccessToken();
    if (refreshToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${refreshToken}`
      });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productName', product.productName);
      formData.append('description', product.description);
      formData.append('totalAmount', product.totalAmount);
      formData.append('quantity', product.quantity);
      return this.http.post<any>(`${this.apiUrl}/new-product`, formData, { headers }).pipe(
        tap(() => {
          console.log('Producto agregado exitosamente');
          this.productChangedSubject.next();
        }),
        catchError((error: any) => {
          return throwError(() => error);
        })
      )
    } else {
      return throwError(() => new Error('No se encontró el token de acceso'));
    }
  }

  onProductChange(): Observable<void> {
    return this.productChangedSubject.asObservable();
  }

  deleteItem(i: any){
    console.log(this.apiUrl + '/delete/' + i.id)
    return this.http.delete<any>(this.apiUrl + '/delete/' + i.id).subscribe(data=>{
      console.log(data)
      this.productChangedSubject.next();
    })
  }

  // TOOLS
  arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }


}
