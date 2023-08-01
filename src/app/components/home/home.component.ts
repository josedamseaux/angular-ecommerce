import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
 
  constructor(private apiService: ApiService, private authService: AuthService, private cartService: CartService){}
  
  shoppingCartCount: number = 0;

  
  ngOnInit() {
    this.getItems();
  }
  
  getItems() {
    this.cartService.shoppingCart$.subscribe(resp => {
      this.shoppingCartCount = resp.itemsInShoppingCart.length
    });
  }

  getMethodFromApiService(){
    this.apiService.getMethod('auth/refresh').subscribe(resp=>{
      console.log(resp)
    })
  }

  logout(){
    this.authService.logout().subscribe(resp=>{
      console.log(resp)
    })
  }

}