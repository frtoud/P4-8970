import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import { ISignature, Signature } from '../fields';
import { BaseFormComponent } from '../base-form.component';


export interface IDemandeAchat
{
  demandeur: {
    id: string;
    assigneA: string;

    nom: string;
    departement: string;
    telephone: string;
  }
  fournisseur: {
    id: string;
    assigneA: string;

    nom: string;
    numero: string;
    adresse: string;
    numero2: string;
    ville: string;
    provice: string;
    postal: string;
    pays: string;
  }
  contact: {
    id: string;
    assigneA: string;

    nom: string;
    courriel: string;
    telephone: string;
    fax: string;
  }
  soumission: {
    id: string;
    assigneA: string;

    numero: string;
    echeance: string;
  }
  livraison: {
    id: string;
    assigneA: string;

    date: Date;
    lieu: string;
    incoterms: string;
  }
  termes: {
    id: string;
    assigneA: string;

    conditions: string;
    moyens: string;
    precisions: string;
  }
  items: {
    id: string;
    assigneA: string;

    frais_transport: number;
    frais_autres: number;
    tableau: IItem[];
  }
  ventilation: {
    id: string;
    assigneA: string;

    tableau: IVentilationDA[];
  }
  commentaire: {
    id: string;
    assigneA: string;

    value: string;
  }
  signatures: ISignature[];
}
export interface IItem{
  id: number;
  ref: number;
  descr: string;
  quant: number;
  prixUnit: number;
}
export interface IVentilationDA{
  id: number;
  ubr: string;
  compte: string;
  unite: string;
  percent: number; 
  montant: number;
}

@Component({
  selector: 'app-demande-achat',
  templateUrl: './demande-achat.component.html',
  styleUrls: ['./demande-achat.component.css']
})
export class DemandeAchatComponent extends BaseFormComponent implements IDemandeAchat {

  demandeur = {
    id: "demandeur",
    assigneA: null,

    nom: "",
    departement: "",
    telephone: "",
  };
  fournisseur = {
    id: "fournisseur",
    assigneA: null,

    nom: "",
    numero: "",
    adresse: "",
    numero2: "",
    ville: "",
    provice: "",
    postal: "",
    pays: "",
  };
  contact = {
    id: "contact",
    assigneA: null,

    nom: "",
    courriel: "",
    telephone: "",
    fax: "",
  };
  soumission = {
    id: "soumission",
    assigneA: null,

    numero: "",
    echeance: "",
  };
  livraison = {
    id: "livraison",
    assigneA: null,

    date: null,
    lieu: "",
    incoterms: "",
  };
  termes = {
    id: "termes",
    assigneA: null,

    conditions: "",
    moyens: "",
    precisions: "",
  };
  items = {
    id: "items",
    assigneA: null,

    frais_transport: 0,
    frais_autres: 0,
    tableau:[
      {id: 0, ref: 0, descr: '', quant: 0, prixUnit: 0},
    ],
  };
  ventilation = {
    id: "ventilation",
    assigneA: null,

    tableau:[
      {id: 0, ubr: '', compte: '', unite: '', percent: 0, montant: 0},
    ],
  };
  commentaire = {
    id: "commentaire",
    assigneA: null,

    value: "",
  };
  signatures = [
    new Signature("sig-boursier", "SIGNATURE DU DEMANDEUR", null, "", false, false, false),
    new Signature("sig-titulaire", "SIGNATURE DU RESPONSABLE(S) DE L'UBR", null, "", false, false, false),
    new Signature("sig-autorise", "SIGNATURE DU SUPÉRIEUR IMMÉDIAT / ADJOINTE AU DIRECTEUR", null, "", false, false, false),
    new Signature("sig-finances", "SERVICE DES FINANCES", null, "", false, false, false),
  ];

  ventilationTotal = 0;
  dSventilation = new MatTableDataSource(this.ventilation.tableau);
  dSitems = new MatTableDataSource(this.items.tableau);
  displayedColumnsVentilation: string[] = ['ubr', 'compte', 'unite', 'percent', 'montant', 'action'];
  displayedColumnsItems: string[] = ['ref', 'descr', 'quant', 'prixUnit', 'totalItems', 'action'];
  itemsTotal = 0;

  onCreate() {
    const id = BaseFormComponent.getHighestId(this.ventilation.tableau) + 1;
    this.ventilation.tableau.push(
      {id: id, ubr: '', compte: '', unite: '', percent: 0, montant: 0, }
    );
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }
  onCreateItem() {
    const id = BaseFormComponent.getHighestId(this.items.tableau) + 1;
    this.items.tableau.push(
      {id: id, ref: 0, descr: '', quant: 0, prixUnit: 0}
    );
    this.dSitems._updateChangeSubscription();
    this.updateTotalItems();
  }

  onDelete(value) {
    console.log(this);
    let index : number = this.ventilation.tableau.findIndex((el:any) => el.id === value.id);
    if (index >= 0)
    {
      this.ventilation.tableau.splice(index, 1);
    }

    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }
  onDeleteItem(value)
  {
    let index : number = this.items.tableau.findIndex((el:any) => el.id === value.id);
    if (index >= 0)
    {
      this.items.tableau.splice(index, 1);
    }

    this.dSitems._updateChangeSubscription();
    this.updateTotalItems();
  }

  updateTotal() {
    this.ventilationTotal = 0;
    this.ventilation.tableau.forEach(element => {
      this.ventilationTotal += element.montant;
    });
  }

  updateTotalItems() {
    this.itemsTotal = 0;
    this.items.tableau.forEach(element => {
      this.itemsTotal += element.prixUnit * element.quant;
    });
  }

  setSections(): void {
    this.sections = [
      this.items, this.ventilation, this.livraison, this.soumission, this.commentaire,
      this.demandeur, this.fournisseur, this.contact, this.termes,
    ];
    // Resetting DataSource bindings for new data
    this.dSventilation = new MatTableDataSource(this.ventilation.tableau);
    this.dSitems = new MatTableDataSource(this.items.tableau);

  }
}

