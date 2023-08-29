import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, forkJoin, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrlForShoppingCart = 'http://localhost:8000/api/purchases/shoppingcart'

  private apiUrlForProducts = 'http://localhost:8000/api/products/get-product/'

  constructor(private http: HttpClient, private authService: AuthService) {
    this.getIdsFromItemsFromShoppingCart()
  }

  private shoppingCart: BehaviorSubject<ShoppingCart> = new BehaviorSubject<ShoppingCart>({
    shoppingCart_id: '',
    shoppingCart_created_at: '',
    shoppingCart_updated_at: '',
    shoppingCart_items: [],
    shoppingCart_user_id: ''
  });

  shoppingCart$ = this.shoppingCart.asObservable()

  shoppingCartAmount: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  shoppingCartAmount$ = this.shoppingCartAmount.asObservable()

  currentAmount: number = 0

  getHeadersAndToken() {
    const refreshToken = this.authService.getRefreshToken();
    if (refreshToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${refreshToken}`
      });
      return headers
    }
    return null
  }

  getIdsFromItemsFromShoppingCart(): Observable<ShoppingCart> {
    let headers = this.getHeadersAndToken()
    if (headers) {
      const itemsFromCart = this.http.get<ShoppingCart>(`${this.apiUrlForShoppingCart}/get-items-from-cart`, { headers })
      itemsFromCart.subscribe((data: ShoppingCart) => {
        this.shoppingCart.next(data);
        this.getAmountOfItemsOnCart()
      })
    }
    return EMPTY
  }

  getItemsOnCart(): Observable<any[]> {
    return this.shoppingCart$.pipe(
      switchMap(data => {
        if (data == null) { return of([]) }
        let items = data.shoppingCart_items;
        const observables: Observable<any>[] = items.map(itemId => {
          const url = `${this.apiUrlForProducts}${itemId}`;
          return this.http.get(url);
        });
        return forkJoin(observables);
      })
    );
  }

  addToCart(itemId: string) {
    let headers = this.getHeadersAndToken()
    if (headers) {
      return this.http.post<any>(`${this.apiUrlForShoppingCart}/add`, { items: itemId }, { headers }).subscribe(data => {
        console.log(data)
        this.getIdsFromItemsFromShoppingCart()
      })
    }
    return null
  }

  getAmountOfItemsOnCart() {
    this.getItemsOnCart().subscribe((data: any[]) => {
      if (data === null) {
        this.shoppingCartAmount.next(0);
      }
      const sum = data.reduce((total, item) => total + item.totalAmount, 0);
      this.shoppingCartAmount.next(sum);
    });
  }

  deleteItemInCart(id: string) {
    let headers = this.getHeadersAndToken()
    if (headers) {
      return this.http.put(`${this.apiUrlForShoppingCart}/delete/${id}`, { id }, { headers }).subscribe(resp => {
        console.log(resp)
        this.getIdsFromItemsFromShoppingCart()
      });
    }
    return EMPTY;
  }

  clearShoppingCart() {
    this.shoppingCart$.subscribe(resp => {
      resp.shoppingCart_items.forEach(id => {
        this.deleteItemInCart(id)
        this.shoppingCartAmount.next(0);
      })
    })
  }

  purchaseSuccessful() {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('sessionId');
    this.clearShoppingCart()
  }

  ngOnDestroy() {
    this.shoppingCart.unsubscribe()
    this.shoppingCartAmount.unsubscribe()
  }

}

interface ShoppingCart {
  shoppingCart_id: string;
  shoppingCart_created_at: string;
  shoppingCart_updated_at: string;
  shoppingCart_items: string[];
  shoppingCart_user_id: string;
}

export class ShippingInfo {
  direccion!: string;
  ciudad!: string;
  codigoPostal!: string;
}

export class AdditionalInfo {
  additionalInfo!: string;
}