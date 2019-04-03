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

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private loginService: LoginService, private router: Router) {
    this.loginService.getUser().then(user=> {
      if(user){
        this.router.navigate(["/dashboard"]);
      }
    }).catch(function(error) {
    });
  }


  login(event) {
    event.preventDefault;
    this.loginService.authenticateUser(this.emailFormControl.value, this.passwordFormControl.value)
    .then(authUser => {
      this.loginService.getUser().then(login=>{console.log(login.firstName);}).catch(function(error) {});
      this.loginError = undefined;
      this.router.navigate(["/dashboard"]);
    })
    .catch(err => {
      this.loginError = err.error;
    });
  }

}
