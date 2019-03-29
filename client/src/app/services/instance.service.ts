
import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Config } from '../config';

import { User, UserService } from './users.service';
 
import { IDemandeAchat } from '../templates/demande-achat/demande-achat.component';
import { IPaymentForm } from '../templates/payment-form/paymentForm.component';
import { IAideFinanciere } from '../templates/aide-financiere-form/app.af-form';
import { IDeplacementForm } from '../templates/form-deplacement/form-deplacement.component';
import { IVoyageForm } from '../templates/voyage-form/voyage-form.component';
import { LoginService } from './login.service';


export interface Collaborateur {
    idCollaborateur: String;
    nom: String;
    email: String;
    //Not mandatory, we can use array index
    ordre: Number;
    acces: String;
}

export interface Attachments {
    nomOriginal: string;
    nomReel: string;
    path: string;
}

export interface Instance {
    _id: string;
    idForm: string;
    auteur: {
        idAuteur: String;
        nom: String;
        typeAuteur: String;
    }
    nomFormulaire: String;
    collaborateurs: Collaborateur[];
    statut: string;
    data: IPaymentForm | IAideFinanciere | IVoyageForm | IDeplacementForm | IDemandeAchat;
    creeLe: Date;
    modifieLe: Date;

    attachements: Attachments[];
}
export interface Diff {
    userId: string;
    data: any;
    attachments: Attachments[];
}

@Injectable({
    providedIn: 'root',
})
export class InstanceService
{
    constructor(private http: HttpClient, private loginService: LoginService) { }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.feedbackMessage || error);
      }

    public postInstance(formdata: IPaymentForm | IAideFinanciere | IVoyageForm | IDeplacementForm | IDemandeAchat,
         attachments: Attachments[], collaborateurs: User[], type: string, nom: string): Promise<any>
    {
        return this.loginService.getUser().then(user => {
        const newInstance: Instance = {
            _id: undefined,
            idForm: type, // identificateur _id Généré serverside
            nomFormulaire: nom,
            auteur: {
                idAuteur: user._id,
                nom: user.firstName + ' ' + user.lastName,
                typeAuteur: user.type,
            },
            statut: '',
            creeLe: null,
            modifieLe: null,
            collaborateurs: collaborateurs.map((u, i) => { // Idealement: mettre cette conversion dans Assign
                const c: Collaborateur = {
                    idCollaborateur: u._id,
                    nom: u.firstName + ' ' + u.lastName,
                    email: u.email,
                    ordre: i,
                    acces: i === 0 ? 'EDITION' : 'WAITING',
                }
                return c;
            }),
            attachements: attachments,

            data: formdata,
        }
        // post
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json'
            })
        };
        const body = { 'form': newInstance };
            return this.http.post<Instance>(`${Config.apiUrl}/forms/new`, body, httpOptions).toPromise()
            .then(res => console.log(res))
            .catch(InstanceService.handleError);
        });
    }

    public getInstance(id:string): Promise<Instance>
    {
        return this.http.get<Instance>(`${Config.apiUrl}/forms/${id}`).toPromise()
        .then(form => form)
        .catch(InstanceService.handleError);
    }

    public patchInstance(id: string, user: string, data: any, attachments: Attachments[])
    {
        const diff: Diff = {
            userId: user,
            data: data,
            attachments: attachments,
        };
        const httpOptions = {
            headers: new HttpHeaders({
            'Content-Type':  'application/json'
            })
        };
        return this.http.patch<Diff>(`${Config.apiUrl}/forms/${id}`, diff, httpOptions).toPromise()
            .then(res => console.log("*****", res))
            .catch(InstanceService.handleError);
    }
    public validateInstance(id: string) {
        return this.http.patch(`${Config.apiUrl}/forms/${id}/archive`, {}, {}).toPromise()
            .then(res => console.log(res))
            .catch(InstanceService.handleError);
    }
    public cancelInstance(id: string) {
        return this.loginService.getUser().then(user => {
            const httpparams = new HttpParams().set('user', user._id);
            return this.http.patch(`${Config.apiUrl}/forms/${id}/cancel`, {}, { params: httpparams }).toPromise()
                .then(res => console.log(res))
                .catch(InstanceService.handleError);
        });
    }
}