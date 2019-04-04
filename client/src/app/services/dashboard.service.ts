import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../config';

export interface Collaborateur {
  email: String;
  idCollaborateur: String;
  nom: String;
  ordre: Number;
  _id: string;
  acces: string;
}

export interface Form {
  auteur: {
      idAuteur: String;
      nom: String;
      typeAuteur: String;
  }
  collaborateurs: Collaborateur[];
  creeLe: Date;
  idForm: string;
  modifieLe: Date;
  nomFormulaire: string;
  statut: string;
  _id: string;
  //TODO : we need a type of form (dashboard search by Patron)
}

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) { }

  private static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.feedbackMessage || error);
  }

  getForms(id: string): Promise<any> {
    return this.http.get(`${Config.apiUrl}/forms/user/${id}`).toPromise()
    .then(forms => forms as Form[])
    .catch(DashboardService.handleError);
  }

  getAllForms(): Promise<any> {
    return this.http.get(`${Config.apiUrl}/forms`).toPromise()
    .then(forms => forms as Form[])
    .catch(DashboardService.handleError);
  }
}
