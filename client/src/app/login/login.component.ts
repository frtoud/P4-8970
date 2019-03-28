import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginError: string;
  isAuthenticated: boolean = false;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private loginService: LoginService, private router: Router) {}

  login(event) {
    event.preventDefault;
    this.loginService.authenticateUser(this.emailFormControl.value, this.passwordFormControl.value)
    .then(authUser => {
      this.loginService.getUser().then(login=>{console.log(login.firstName);});
      this.isAuthenticated = true;
      this.loginError = undefined;
      this.router.navigate(["dashboard"]);
    })
    .catch(err => {
      this.isAuthenticated = false;
      this.loginError = err.error;
    });
  }

}
