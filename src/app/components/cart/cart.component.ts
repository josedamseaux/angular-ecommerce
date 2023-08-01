import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private cartService: CartService){}

  productsInCart: any = []


  ngOnInit(): void {
    this.getItemsInCart()  
  }


  getItemsInCart(){
    this.cartService.shoppingCart$.subscribe(items=>{
      console.log(items)
      this.productsInCart = items.itemsInShoppingCart
      console.log(this.productsInCart)

    })
  }

  deleteFromCart(product: any){
    console.log(product)
    // this.productsInCart = this.productsInCart.filter((item: any) => item !== product);
    this.cartService.deleteFromCart(product)
  }
}
