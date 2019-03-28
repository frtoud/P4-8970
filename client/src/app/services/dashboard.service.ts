import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../config';
import { FormsModule } from '@angular/forms';


// export interface Collaborateur {
//   idCollaborateur: String;
//   nom: String;
//   email: String;
//   //Not mandatory, we can use array index
//   ordre: Number;
//   acces: String;
// }

// export interface Instance {
//   idForm: string;
//   auteur: {
//       idAuteur: String;
//       nom: String;
//       typeAuteur: String;
//   }
//   nomFormulaire: String,
//   collaborateurs: Collaborateur[];
//   statut: string;
//   data: IPaymentForm | IAideFinanciere | IVoyageForm | IDeplacementForm;
//   creeLe: Date;
//   modifieLe: Date;

// }

// Status
// this.userAccess = ["WAITING", "EDITION", "COMPLETED", "PREVIEW"];
// this.formStatus = ["IN_PROGRESS", "COMPLETED", "ARCHIVED"];
// this.types = ['ADMIN', 'MANAGER', 'USER'];

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
  idForm: string;
  creeLe: Date;
  modifieLe: Date;
  statut: string;
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
