import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private loginService: LoginService) {}

  ngOnInit() {
  }

  login(event) {
    event.preventDefault;
    this.loginService.authenticateUser(this.emailFormControl.value, this.passwordFormControl.value)
    .then(authUser => console.log(authUser))
    .catch(err => console.log(err));
  }

}
