import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let token = sessionStorage.getItem("acc_tkn");
    if (token) {
    let user = JSON.parse(sessionStorage.getItem('currentUser'));
      if (user.type == "ADMIN") {
        return true;
      } else {
        window.alert("Cette zone est réservée aux administrateurs.");
        return false;
      }
    } else {
      return false;
    }
  }
}

