import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      let token = localStorage.getItem("acc_tkn");
      //const user = this.loginService.getUser();
  
      
     if(token){
      let user = JSON.parse(localStorage.getItem('currentUser'));
        if(user.type == "ADMIN"){
          return true;
        }else{
          return false;
        }
     }else{
      return false;
     }
    }
  }

