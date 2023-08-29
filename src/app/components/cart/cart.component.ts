import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AdditionalInfo, CartService, ShippingInfo } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private cartService: CartService, private productService: ProductService, private http: HttpClient) { }

  productsInCart: any = []

  private apiForPurchase = 'http://localhost:8000/api/payments/pay-with-stripe'

  sessionId!: string;
  paymentStatus!: string;
  messageForPayment!: string;

  shippingInfo: ShippingInfo = new ShippingInfo(); // Instancia del modelo
  additionalInfo: AdditionalInfo = new AdditionalInfo(); // Instancia del modelo
  
  ngOnInit() {
    this.messageForPayment = ''
    this.getItemsInCart()
    const user = localStorage.getItem("username")

    console.log(user)
    const sessionId = localStorage.getItem('sessionId');
    console.log(sessionId)

    if (sessionId) {
      // El sessionId está presente en el almacenamiento local
      console.log('Session ID:', sessionId);
      // this.getPaymentStatus(sessionId);

    } else {
      // El sessionId no está presente en el almacenamiento local
      console.log('Session ID no encontrado.');
    }
  }

  getPaymentStatus(sessionId: string) {
    const apiUrl = 'http://localhost:8000/api/payments/get-payment-status'; // Cambia la URL según tu configuración
    const data = { sessionId: sessionId };

    return this.http.post(apiUrl, data).subscribe((response: any) => {
      this.paymentStatus = response.payment_status;
      console.log(response)
      if(response.payment_status === 'paid'){
        this.router.navigateByUrl('/payment')
        this.clearCartAfterSuccessfullPurchase()
        // localStorage.removeItem('sessionId');
      } else {
        this.messageForPayment = '¡Lo sentimos! Hubo un problema con el pago'
      }
    });
  }

  getItemsInCart() {
    this.cartService.getItemsOnCart().subscribe((DATA: any) => {
      console.log(DATA);
      this.productsInCart = DATA.map((element: any) => {
        return {
          ...element,
          imgUrl: this.getProductImageUrl(element.imageData.data, element.imageData.type)
        };
      });
    });
  }

  getProductImageUrl(data: ArrayBuffer, type: string): string {
    const base64Image = this.productService.arrayBufferToBase64(data);
    return 'data:' + type + ';base64,' + base64Image;
  }

  deleteFromCart(product: any) {
    let id: string = product.id
    this.cartService.deleteItemInCart(id)
    this.cartService.shoppingCart$.subscribe(resp=>{
      console.log(resp)
      if(resp.shoppingCart_items.length === 0){
        this.productsInCart = []
        this.cartService.shoppingCartAmount.next(0 )
      }
    })
  }

  async payWithStripe() {
    let cart = JSON.parse(JSON.stringify(this.productsInCart));

    for (let i = 0; i < cart.length; i++) {
      delete cart[i].imageData
      delete cart[i].imgUrl;
    }

    const refreshToken = this.authService.getRefreshToken();
    const storedJsonString = localStorage.getItem('userInfo');

    if (storedJsonString) {
      const storedData = JSON.parse(storedJsonString);
      console.log(storedData.email); // Output: value1
      console.log(storedData.username); // Output: value2
      console.log(storedData.firstName); // Output: value2
      console.log(storedData.lastName); // Output: value2

      const cartWithUserInfo = {
        cart: cart,
        shippingInfo:  `${this.shippingInfo.direccion}. ${this.shippingInfo.ciudad}, ${this.shippingInfo.codigoPostal}`,
        additionalInfo: this.additionalInfo.additionalInfo,
        status: ''
      }

      console.log(cartWithUserInfo)
      if (refreshToken) {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${refreshToken}`
        });

        return this.http.post<any>(this.apiForPurchase, { cartWithUserInfo }, { headers }).subscribe(resp => {
          console.log(resp)
          const sessionUrl = resp.url;
          localStorage.setItem('sessionId', resp.sessionResp.id);
          localStorage.setItem('purchaseId', resp.resp);
          window.location.href = sessionUrl;

          const sessionId = localStorage.getItem('sessionId');
          const purchaseId = localStorage.getItem('purchaseId');

          // console.log(resp)
          // console.log(resp)

        })
      }
    } else {
      console.log('No hay datos almacenados en localStorage.');
    }
    return null
  }

  clearCartAfterSuccessfullPurchase(){
    this.cartService.clearShoppingCart()
  }

}


