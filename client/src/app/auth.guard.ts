import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService){}

  canActivate(): boolean  {
    let token = localStorage.getItem("acc_tkn");

   if (token) {
    return true;
   }
   else {
    this.router.navigate(["login"]);
    return false;
   }
  }
}
