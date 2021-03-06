import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../config';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AuthenticatedUser {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: string;
    token: string;
}

@Injectable()
export class LoginService {
  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<AuthenticatedUser>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }
  
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentUserSubject: BehaviorSubject<AuthenticatedUser>;
  public currentUser: Observable<AuthenticatedUser>;
  
  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.feedbackMessage || error);
  }

  authenticateUser(email: string, password: string): Promise<AuthenticatedUser> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
    };
    const body = { "user": { "email": email, "password": password }};
    return this.http.post<AuthenticatedUser>(`${Config.apiUrl}/users/login`, body, httpOptions).toPromise()
    .then(user => {
      this.loggedIn.next(true);
      sessionStorage.setItem("acc_tkn", user.token);
      sessionStorage.setItem("currentUser", JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
    })
    .catch(LoginService.handleError);
  }

  getUser(): Promise<AuthenticatedUser> {
    return new Promise<AuthenticatedUser>((resolve, reject) => {
      if (this.currentUserSubject.value) {
      resolve(this.currentUserSubject.value);
      } 
      else {
        console.log("Error found in loginService: getUser()")
        reject('No user in loginService');
      }});
  }

  getUserOldVersion():Promise<AuthenticatedUser> {
    return new Promise<AuthenticatedUser>((resolve, reject) => {
    let user = JSON.parse(sessionStorage.getItem('currentUser'));
      
      if (user) {
        resolve(user);
      } 
      else {
        console.log("Error in loginService: getUser()")
        reject('No user in local storage');
      }});
  }

  logout(){
    this.loggedIn.next(false);
    sessionStorage.removeItem("acc_tkn");
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
      return this.loggedIn.asObservable();
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  validateActivationLink(id: string) : Promise<any> {
    return this.http.get(`${Config.apiUrl}/users/verify/${id}`).toPromise()
    .then(() => true)
    .catch(LoginService.handleError);
  }

  setNewPassword(id: string, password: string) : Promise<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const body = { "user": { "password": password }};
    return this.http.patch(`${Config.apiUrl}/users/verify/${id}`, body, httpOptions)
    .toPromise()
    .then(user => user)
    .catch(LoginService.handleError);
  }
}