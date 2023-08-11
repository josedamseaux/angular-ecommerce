import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  private apiUrl = 'http://localhost:8000/api/purchases/shoppingcart'


  constructor(private http: HttpClient, private authService: AuthService) {
    const savedCart = JSON.parse(localStorage.getItem('shoppingCart') ?? '[]');
    if (savedCart && savedCart.length > 0) {
      this.currentItems = savedCart;
      this.shoppingCart.next({ itemsInShoppingCart: this.currentItems });
    }
  }

  private shoppingCart: BehaviorSubject<ShoppingCart> = new BehaviorSubject<ShoppingCart>({ itemsInShoppingCart: [] });
  shoppingCart$ = this.shoppingCart.asObservable()
  currentItems: any = [];

  private shoppingCartAmount: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  shoppingCartAmount$ = this.shoppingCartAmount.asObservable()
  currentAmount: number = 0

  getItemsFromShoppingCart() {
    const refreshToken = this.authService.getRefreshToken();
    if (refreshToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${refreshToken}`
      });
      return this.http.get<any>(`${this.apiUrl}/get-items-from-cart`, { headers })
    }
    return null
  }

  addToCart2(item: any) {
    const refreshToken = this.authService.getRefreshToken();
    if (refreshToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${refreshToken}`
      });

      let id: any = []
      id.push(item.id)

      console.log(id)
      return this.http.post<any>(`${this.apiUrl}/add`, { items: id }, { headers }).subscribe(data => {
        console.log(data)
      })
    }

    return null
  }

  saveCartInLocal() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.currentItems));
    console.log(this.currentItems)
    const cart = { itemsInShoppingCart: this.currentItems };

    this.shoppingCart.next(cart);
  }

  deleteFromCart(product: any) {
    this.currentItems = this.currentItems.filter((item: any) => item !== product);
    this.saveCartInLocal()
    this.amountInShoppingCart();
  }

  amountInShoppingCart() {
    this.currentAmount = 0;
    this.currentItems.forEach((resp: any) => {
      let numbers = Number(resp.totalAmount)
      console.log(numbers)
      this.currentAmount += numbers;
      this.shoppingCartAmount.next(this.currentAmount)
    })
  }

}

interface Item {
  id: string;
  productName: string;
  imges: string;
  description: string;
  totalAmount: string;
  quantity: number;
}

interface ShoppingCart {
  itemsInShoppingCart: Item[];
}