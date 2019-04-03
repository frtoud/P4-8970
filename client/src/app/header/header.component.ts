import { Component } from '@angular/core';
import { LoginService, AuthenticatedUser } from '../services/login.service';
import {MatButtonModule} from '@angular/material/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {
  constructor(private loginService: LoginService) {
    this.loginService.currentUser.subscribe(x => this.currentUser = x);
  }

  currentUser: AuthenticatedUser;
  isLoggedIn$: Observable<boolean>;



  private logOut(){

    this.loginService.logout();

  }

  private isAdmin():boolean {
    return(this.currentUser.type=="ADMIN");
  }

  private isGestionnaire():boolean {
    let isGestOrAdmin:boolean = false;
    if(this.currentUser.type=="MANAGER"){
      isGestOrAdmin=true;
    }
    if(this.currentUser.type=="ADMIN"){
      isGestOrAdmin=true;
    }
    return(isGestOrAdmin);
  }
  

  ngOnInit() {

    this.isLoggedIn$ = this.loginService.isLoggedIn();
    this.loginService.getUser().then(login=>{this.currentUser = login ;}).catch(function(error) {});
    
  }
  
}
