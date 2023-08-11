import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { isAdminGuard } from './guards/isadmin.guard';
import { ErrorpageComponent } from './components/errorpage/errorpage.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'products', component: ProductsComponent},
  {path:'not-found', component: ErrorpageComponent},
  {path:'cart', component: CartComponent},
  {path:'admin-panel', component: AdminPanelComponent, canActivate:[isAdminGuard]},
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {
    path: '',
    redirectTo: 'home', 
    pathMatch: 'full',
  },  
  {
    path: '**',
    redirectTo: 'home', 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
