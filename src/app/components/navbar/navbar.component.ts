import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private apiService: ApiService, private authService: AuthService, private cartService: CartService){}
  
  shoppingCartCount: number = 0;
  shoppingCartTotal: number = 0;

  ngOnInit() {
    this.getItems();
  }
  
  getItems() {
    this.cartService.shoppingCart$.subscribe(resp => {
      this.shoppingCartCount = resp.itemsInShoppingCart.length
    });

    this.cartService.shoppingCartAmount$.subscribe(data=>{
      console.log(data)
      this.shoppingCartTotal = data
    })

    this.cartService.getItemsFromShoppingCart()?.subscribe(data=>{
      this.shoppingCartCount = data.length
      console.log(data)
    })
  }

}
