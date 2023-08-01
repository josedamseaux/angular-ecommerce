import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductInterface } from '../interfaces/product.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {

  response: any;
  imgs: any[] = [];

  product: ProductInterface = {
    productName: '',
    description: '',
    totalAmount: 0,
    quantity: 0
  };

  selectedFile: File | null = null;
  private productAddedSubscription: Subscription;

  constructor(private productService: ProductService) {
    this.getData();
    // Suscribirse a la notificación de productos agregados o eliminados
    this.productAddedSubscription = this.productService.onProductChange().subscribe(() => {
      this.getData();
    });
  }

  deleteItem(i: any) {
    this.productService.deleteItem(i)
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  getData() {
    this.imgs = [];
    this.productService.getProducts().subscribe((reso: any) => {
      console.log(reso);
      this.response = reso;
      reso.forEach((element: any) => {
        const base64Image = this.productService.arrayBufferToBase64(element.imageData.data);
        element.imges = ['data:' + element.imageData.type + ';base64,' + base64Image];
      });
    });
  }

  onSubmit(form: any) {
    if (form.valid && this.selectedFile) {
      this.productService.addProduct(this.product, this.selectedFile)
        .subscribe(response => {
          console.log(response)
          form.reset();
          if (response) {
            // Response de exito es 'Producto agregado exitosamente:'
            console.log('Producto agregado exitosamente:', response);
          }
        });
    }
  }

  ngOnDestroy() {
    this.productAddedSubscription.unsubscribe();
  }

}
