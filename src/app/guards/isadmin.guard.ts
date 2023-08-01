import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';

export const isAdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const jwtService = inject(JwtService);
  const authService = inject(AuthService);
  let router = inject(Router)

  let accessToken = authService.getAccessToken()
  let decodedToken = jwtService.decodeToken(accessToken)
  console.log(decodedToken)

  if(decodedToken?.username === 'adminuser'){
    console.log(decodedToken)
    return true
  } else {
    router.navigateByUrl('/not-found')
    return false
  }

}