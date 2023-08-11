import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductInterface } from '../../interfaces/product.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  products: any;
  imgs: any[] = [];

  private productAddedSubscription: Subscription;

  constructor(private productService: ProductService, private router: Router, private cartService: CartService) {
    this.getData();
    // Suscribirse a la notificación de productos agregados o eliminados
    this.productAddedSubscription = this.productService.onProductChange().subscribe(() => {
      this.getData();
    });
  }

  getData() {
    this.imgs = [];
    this.productService.getProducts().subscribe((reso: any) => {
      console.log(reso);
      this.products = reso;
      reso.forEach((element: any) => {
        const base64Image = this.productService.arrayBufferToBase64(element.imageData.data);
        element.imges = ['data:' + element.imageData.type + ';base64,' + base64Image];
        delete element.imageData; // Eliminar la propiedad imageData

      });
    });
  }
  
  productDetails(i: number) {
    this.router.navigate(['/product', i]);
  }

  addToCart(product: any){
    console.log(product)
    // this.cartService.addToCart(product)
    this.cartService.addToCart2(product)
  }


  ngOnDestroy() {
    this.productAddedSubscription.unsubscribe();
  }

}