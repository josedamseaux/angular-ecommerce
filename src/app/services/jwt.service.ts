import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  decodeToken(token: string | null){
    if (token) {
      let accesToken = jwt_decode<JwtToken>(token)
      console.log(accesToken)
      return accesToken
    }
    else {
      return null
    }
  }
}


interface JwtToken {
  sub: string;
  username: string;
  roles: string[];
}