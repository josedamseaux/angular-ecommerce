import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
 
  constructor(private router: Router, private apiService: ApiService, private authService: AuthService, private cartService: CartService){}
  
  shoppingCartCount: number = 0;

  
  ngOnInit() {
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

  login(){
    this.router.navigateByUrl('/login')
  }

}