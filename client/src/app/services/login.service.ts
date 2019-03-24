import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../config';

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
  constructor(private http: HttpClient) { }

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
    .then(user => user)
    .catch(LoginService.handleError);
  }
}