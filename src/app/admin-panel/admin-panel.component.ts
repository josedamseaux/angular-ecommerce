import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductInterface } from '../interfaces/product.interface';
import { Subscription } from 'rxjs';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  usersData: any = {
    users: [],
    totalCount: 0,
    totalPages: 0,
  };
  currentPage: number = 1;

  product: ProductInterface = {
    productName: '',
    description: '',
    totalAmount: 0,
    quantity: 0
  };
  response: any;
  imgs: any[] = [];

  selectedFile: File | null = null;

  private productAddedSubscription: Subscription;

  searchValue: string = ''

  userFound: any | undefined;

  onInputChange() {
    console.log(this.searchValue);
  };

  constructor(private productService: ProductService, private usersService: UsersService) {
    this.getData();
    this.productAddedSubscription = this.productService.onProductChange().subscribe(() => {
      this.getData();
    });
  }

  onKey(event: any) {
    this.searchValue = event.target.value;
    console.log(this.searchValue)
  }

  ngOnInit(): void {
    this.getUsers(this.currentPage);
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
          form.reset();
          if (response) {
            console.log('Producto agregado exitosamente:', response);
          }
        });
    }
  }

  async getUsers(page: number) {
    const data: any = await this.usersService.getUsers(page).toPromise();
    console.log(data);
    this.usersData.users = data.users;
    this.usersData.totalCount = data.totalCount;
    this.usersData.totalPages = data.totalPages;
  }

  async findUserAndPurchases() {
    console.log(this.searchValue)

    if(this.searchValue === ''){
      this.userFound = []
    }
    const data: any = await this.usersService.findUserAndPurchases(this.searchValue).toPromise()
    this.userFound = data
    console.log(data);
  }

  async clickOnUser(i: any){
    const data: any = await this.usersService.findUserAndPurchases(i.username).toPromise()
    this.userFound = data
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.usersData.totalPages }, (_, i) => i + 1);
  }

  goToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.getUsers(this.currentPage);
  }

  ngOnDestroy() {
    this.productAddedSubscription.unsubscribe();
  }

}
