import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor() {
    const savedCart = JSON.parse(localStorage.getItem('shoppingCart') ?? '[]');
    if (savedCart && savedCart.length > 0) {
      this.currentItems = savedCart;
      this.shoppingCart.next({ itemsInShoppingCart: this.currentItems });
    }
   }

  private shoppingCart: BehaviorSubject<ShoppingCart> = new BehaviorSubject<ShoppingCart>({ itemsInShoppingCart: []});
  shoppingCart$ = this.shoppingCart.asObservable()
  currentItems:any = [];

  addToCart(item:any){
    this.currentItems.push(item);
    localStorage.setItem('shoppingCart', JSON.stringify(this.currentItems));
    console.log(this.currentItems)
    const cart = { itemsInShoppingCart: this.currentItems };
    this.shoppingCart.next(cart);
  }

  saveCartInLocal() {
    localStorage.setItem('shoppingCart', JSON.stringify(this.currentItems));
    console.log(this.currentItems)
    const cart = { itemsInShoppingCart: this.currentItems };
    this.shoppingCart.next(cart);
    }

    deleteFromCart(product: any){
      this.currentItems = this.currentItems.filter((item: any) => item !== product);
      this.saveCartInLocal()
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