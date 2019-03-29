import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../config';

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    type: string;
}


@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) { }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.feedbackMessage || error);
    }

    getAllUsers() :Promise<User[]>
    {
        return this.http.get<User>(`${Config.apiUrl}/users`).toPromise()
        .then(user => user)
        .catch(UserService.handleError);
    }
    mockUsers() :Promise<User[]>
    {
        return Promise.resolve([
            { _id:"1", firstName: "A", lastName: "AA", email:"a@a.a", type:"ADMIN"},
            { _id:"2", firstName: "B", lastName: "AD", email:"b@a.a", type:"ADMIN"},
            { _id:"3", firstName: "C", lastName: "BA", email:"c@a.a", type:"ADMIN"},
            { _id:"4", firstName: "D", lastName: "AC", email:"d@a.a", type:"ADMIN"},
            { _id:"5", firstName: "E", lastName: "EE", email:"e@a.a", type:"ADMIN"},
        ]);
    }
}