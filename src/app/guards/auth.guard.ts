// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(public auth: Auth,  private router: Router,){}

//   isLogged(){
//     let isAuth: boolean = false
//     getAuth().onAuthStateChanged(user => {
//       console.log(user)
//       if(user != undefined){
//         isAuth = true
//       }
//     })

//     return isAuth
//   }

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
//         return this.isLogged()
//   }
  
// }
