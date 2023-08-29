import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private cartService: CartService, private authService: AuthService) {}
  private usernameSubscription: Subscription | undefined;

  user: string | null = '';
  shoppingCartCount: number = 0;
  shoppingCartTotal: number = 0;

  ngOnInit() {
    this.getItems();
    this.getUsername()
  }

  getUsername() {
    if (this.user == ''){
      this.user = 'visitante'
    }

    const storedUsername = localStorage.getItem('username');

    if (storedUsername) {
      this.user = storedUsername;
    } else {
      this.usernameSubscription = this.authService.username$.subscribe(data => {
        this.user = data;
        localStorage.setItem('username', data); // Almacenar en localStorage
      });
    }
  }

  getItems() {
    this.cartService.shoppingCart$.subscribe(data => {
      this.shoppingCartCount = data.shoppingCart_items.length
    })
    this.cartService.shoppingCartAmount$.subscribe(resp => {
      console.log(resp)
      this.shoppingCartTotal = resp
    })
  }

  ngOnDestroy() {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }
}
