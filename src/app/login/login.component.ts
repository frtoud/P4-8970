import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';

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

  constructor(private loginService: LoginService) {}

  login(event) {
    event.preventDefault;
    this.loginService.authenticateUser(this.emailFormControl.value, this.passwordFormControl.value)
    .then(authUser => {
      console.log(authUser);
      this.isAuthenticated = true;
      this.loginError = undefined;
      //TODO: Save JWT
      //TODO: Navigate to dashboard
    })
    .catch(err => {
      this.isAuthenticated = false;
      this.loginError = err.error;
    });
  }

}
