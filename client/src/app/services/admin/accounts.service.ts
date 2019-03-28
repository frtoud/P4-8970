import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../../config';

export interface Account {
    firstName: string;
    lastName: string;
    email: string;
    type: string;
}

@Injectable()
export class AccountsService {
  constructor(private http: HttpClient) { }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.feedbackMessage || error);
  }

  getAccounts(): Promise<any> {
    return this.http.get(`${Config.apiUrl}/users`).toPromise()
    .then(accounts => accounts)
    .catch(AccountsService.handleError);
  }

  getAccountByID(id: string) {
    return this.http.get(`${Config.apiUrl}/users/${id}`).toPromise()
    .then(account => account as Account)
    .catch(AccountsService.handleError);
  }

  addAccount(account: Account) : Promise<any> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
    };
    const body = { "user": account };
    return this.http.post<Account>(`${Config.apiUrl}/admin/users/new`, body, httpOptions).toPromise()
    .then(account => account)
    .catch(AccountsService.handleError);
  }

  editAccount(id: string, account: Account) : Promise<any> {
    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
    };
    const body = { "user": account };
    return this.http.patch<Account>(`${Config.apiUrl}/admin/users/${id}`, body, httpOptions).toPromise()
    .then(account => account)
    .catch(AccountsService.handleError);
  }

  triggerResetPassword(id: string) : Promise<any> {
    return this.http.get(`${Config.apiUrl}/admin/users/reset/${id}`).toPromise()
    .then(() => true)
    .catch(AccountsService.handleError);
  }

  deleteAccount(id: string) {
    return this.http.delete(`${Config.apiUrl}/admin/users/${id}`).toPromise()
    .then(() => "Compte supprimé avec succès!")
    .catch(AccountsService.handleError);
  }
}