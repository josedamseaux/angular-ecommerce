import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const user = { username: this.username, password: this.password };
    console.log(user);

    this.authService.login(user).subscribe((data) => {
      console.log('aca' + data.username);
      console.log('aca' + data.accessToken);
      console.log('aca' + data.refreshToken);

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;
      this.authService.saveTokens(accessToken, refreshToken);

      if(data.username){
        this.router.navigateByUrl('/home')
      }
    });
  }
}
