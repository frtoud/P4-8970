import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { Signature, ISignature } from '../fields';
import { BaseFormComponent } from '../base-form.component';

export interface IVentilationRD
{
  id: number;
  ubr: string;
  compte: string;
  unite: string;
  montant: number;
  code: string;
  commentaire: string;
}

export interface IDeplacementForm
{
  entite_externe :
  {
    id:  string;
    assigneA:  string;

    matricule:  string;
    statut:  string;
    adresse:  string;
    telephone:  string;
    institut:  string;
  }
  endroit_duree :
  {
    id: string;
    assigneA: string;

    endroit: string;
    du:  Date;
    au:  Date;
  }
  
  but :
  {
    id:  string;
    assigneA: string;

    valeur: string;
  }
  
  ventilation : 
  {
    id: string;
    assigneA: string;

    tableau: IVentilationRD[];

    recu: number;
    paiement: number;
    remboursement: number;
  }

  signatures : ISignature[];

  annexe : {
    id: string;
    assigneA: string;

    //???
  }
}

@Component({
  selector: 'app-form-deplacement',
  templateUrl: './form-deplacement.component.html',
  styleUrls: ['./form-deplacement.component.css']
})
export class FormDeplacementComponent extends BaseFormComponent implements IDeplacementForm, OnInit {

  currency = ["CAD", "USD", "EUR", "GBP", "CHF", "BRL"];

  entite_externe =
  {
    id: "entite_externe",
    assigneA: null,

    matricule: "",
    statut: "",
    adresse: "",
    telephone: "",
    institut: "",
  }
  endroit_duree = 
  {
    id: "endroit_duree",
    assigneA: null,

    endroit: "",
    du: null,
    au: null,
  }
  
  but = 
  {
    id: "but",
    assigneA: null,

    valeur: "",
  }
  
  ventilation = 
  {
    id: "ventilation",
    assigneA: null,

    tableau: [
    {id:0, ubr:"", compte:"", unite:"", montant:0, code:"", commentaire:"" },
    {id:1, ubr:"", compte:"", unite:"", montant:0, code:"", commentaire:"" },
    {id:2, ubr:"", compte:"", unite:"", montant:0, code:"", commentaire:"" },
    ],

    recu: 0,
    paiement: 0,
    remboursement: 0,
  }

  signatures = [
    new Signature("sig-demandeur", "SIGNATURE DU DEMANDEUR", null, "", false, false, false),
    new Signature("sig-ubr", "SIGNATURE DU (DES) RESPONSABLES(S) DE L'UBR", null, "", false, false, false),
    new Signature("sig-superieur", "SIGNATURE DU SUPÉRIEUR IMMÉDIAT", null, "", false, false, false),
    new Signature("sig-finances", "SERVICE DES FINANCES", null, "", false, false, false),
  ];

  annexe = {
    id: "annexe",
    assigneA: null,

    //???
  }

  private dureeDeplacement: number = 0;
  private bothFilled = false;

  montant :number = 0;
  ventilationTotal :number = 0;
  rowID: number = 2;

  nomDemandeur: string = "";
  demandeurChecked: boolean = false;
  signatureAdded: boolean = false;

  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'montant', 'code', 'commentaire', 'action'];

  dSventilation = new MatTableDataSource(this.ventilation.tableau);

  updateTotal()
  {
    this.ventilationTotal = 0;
    this.ventilation.tableau.forEach(element => {
      this.ventilationTotal += element.montant;
    });
  }

  onCreate()
  {
    this.ventilation.tableau.push(
      {id:this.rowID, ubr:"", compte:"", unite:"", montant:0, code:"", commentaire:"" }
    );
    this.rowID++;
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }

  onDelete(value)
  {
    for (let i = 0; i < this.ventilation.tableau.length; i++) {
      if (this.ventilation.tableau[i].id === value) {
          this.ventilation.tableau.splice(i, 1);
      }
    }
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }

  ngOnInit() {
  }

  private duChange(str: any): void {
    this.endroit_duree.du = str;
    this.updateDuree();
  }

  private auChange(str: any): void {
    this.endroit_duree.au = str;
    this.updateDuree();
  }

  private updateDuree(): void {
    this.bothFilled = (this.endroit_duree.au !== null && this.endroit_duree.du !== null);
    if (this.bothFilled)
    {
      this.dureeDeplacement = this.endroit_duree.au.valueOf() - this.endroit_duree.du.valueOf();
      this.dureeDeplacement = Math.round((((this.dureeDeplacement/60)/60)/24)/1000);
    }
  }

    setSections(): void {
      this.sections = [
      this.entite_externe, this.ventilation,
      this.annexe, this.endroit_duree, this.but,
    ];
    this.dSventilation = new MatTableDataSource(this.ventilation.tableau);
    }
}