import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import { ISignature, Signature } from '../fields';
import { BaseFormComponent } from '../base-form.component';
import { PhoneRegex } from '../common_validator';


export interface IDemandeAchat {
  commande: {
    id: string;
    assigneA: string;

    standard: boolean;
    entente: boolean;
  };
  finances: {
    id: string;
    assigneA: string;

    technique: string;
    commande: string;
  };
  demandeur: {
    id: string;
    assigneA: string;

    nom: string;
    departement: string;
    telephone: string;
  };
  fournisseur: {
    id: string;
    assigneA: string;

    nom: string;
    telephone: string;
    adresse: string;
    fax: string;
    ville: string;
    province: string;
    postal: string;
    pays: string;
  };
  contact: {
    id: string;
    assigneA: string;

    nom: string;
    courriel: string;
    telephone: string;
    fax: string;
  };
  soumission: {
    id: string;
    assigneA: string;

    numero: string;
    echeance: Date;
  };
  livraison: {
    id: string;
    assigneA: string;

    date: Date;
    lieu: string;
    incoterms: string;
  };
  termes: {
    id: string;
    assigneA: string;

    conditions: string;
    moyens: string;
    precisions: string;
  };
  items: {
    id: string;
    assigneA: string;

    tableau: IItem[];
    transport: number;
    autres: number;
  };
  ventilation: {
    id: string;
    assigneA: string;

    tableau: IVentilationDA[];
  };
  commentaire: {
    id: string;
    assigneA: string;

    value: string;
  };
  signatures: ISignature[];
}
export interface IItem {
  id: number;
  ref: number;
  descr: string;
  quant: number;
  prixUnit: number;
}
export interface IVentilationDA {
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

  commande = {
    id: 'commande',
    assigneA: null,

    standard: false,
    entente: false,
  };
  finances = {
    id: 'finances',
    assigneA: null,

    technique: '',
    commande: '',
  };
  demandeur = {
    id: 'demandeur',
    assigneA: null,

    nom: '',
    departement: '',
    telephone: '',
  };
  fournisseur = {
    id: 'fournisseur',
    assigneA: null,

    nom: '',
    telephone: '',
    adresse: '',
    fax: '',
    ville: '',
    province: '',
    postal: '',
    pays: '',
  };
  contact = {
    id: 'contact',
    assigneA: null,

    nom: '',
    courriel: '',
    telephone: '',
    fax: '',
  };
  soumission = {
    id: 'soumission',
    assigneA: null,

    numero: '',
    echeance: null,
  };
  livraison = {
    id: 'livraison',
    assigneA: null,

    date: null,
    lieu: '',
    incoterms: '',
  };
  termes = {
    id: 'termes',
    assigneA: null,

    conditions: '',
    moyens: '',
    precisions: '',
  };
  items = {
    id: 'items',
    assigneA: null,

    tableau: [
      {id: 0, ref: 0, descr: '', quant: 0, prixUnit: 0},
    ],
    transport: 0,
    autres: 0,
  };
  ventilation = {
    id: 'ventilation',
    assigneA: null,

    tableau: [
      {id: 0, ubr: '', compte: '', unite: '', percent: 0, montant: 0},
    ],
  };
  commentaire = {
    id: 'commentaire',
    assigneA: null,

    value: '',
  };
  signatures = [
    new Signature('sig-boursier', 'SIGNATURE DU DEMANDEUR', null, '', false, false, false),
    new Signature('sig-titulaire', 'SIGNATURE DU RESPONSABLE(S) DE L\'UBR', null, '', false, false, false),
    new Signature('sig-autorise', 'SIGNATURE DU SUPÉRIEUR IMMÉDIAT / ADJOINTE AU DIRECTEUR', null, '', false, false, false),
    new Signature('sig-finances', 'SERVICE DES FINANCES', null, '', false, false, false),
  ];

  ventilationTotal = 0;
  dSventilation = new MatTableDataSource(this.ventilation.tableau);
  dSitems = new MatTableDataSource(this.items.tableau);
  displayedColumnsVentilation: string[] = ['ubr', 'compte', 'unite', 'percent', 'montant', 'action'];
  displayedColumnsItems: string[] = ['ref', 'descr', 'quant', 'prixUnit', 'totalItems', 'action'];
  itemsTotal = 0;
  itemsSTotal = 0;
  taxeTPS = 0;
  taxeTVQ = 0;
  engagement = 0;

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
    const index: number = this.ventilation.tableau.findIndex((el: any) => el.id === value.id);
    if (index >= 0) {
      this.ventilation.tableau.splice(index, 1);
    }

    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }
  onDeleteItem(value) {
    const index: number = this.items.tableau.findIndex((el: any) => el.id === value.id);
    if (index >= 0) {
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
    this.itemsSTotal = 0;
    this.items.tableau.forEach(element => {
      this.itemsSTotal += element.prixUnit * element.quant;
    });
    const pretax = this.itemsSTotal + this.items.transport + this.items.autres;
    this.taxeTPS = pretax * 0.05; // Todokete: constante?
    this.taxeTVQ = pretax * 0.09975; // Todokete: constante?
    this.engagement = pretax + this.taxeTPS * 0.33 + this.taxeTVQ * 0.53;
    this.itemsTotal = pretax + this.taxeTPS + this.taxeTVQ;
  }

  setSections(): void {
    this.sections = [
      this.items, this.ventilation, this.livraison, this.soumission, this.commentaire,
      this.demandeur, this.fournisseur, this.contact, this.termes, this.commande, this.finances
    ];
    // Resetting DataSource bindings for new data
    this.dSventilation = new MatTableDataSource(this.ventilation.tableau);
    this.dSitems = new MatTableDataSource(this.items.tableau);

  }

  initCalculs() {
    this.updateTotal();
    this.updateTotalItems();
  }

  fg_commande: FormGroup;
  fg_finances: FormGroup;
  fg_demandeur: FormGroup;
  fg_fournisseur: FormGroup;
  fg_contact: FormGroup;
  fg_soumission: FormGroup;
  fg_livraison: FormGroup;
  fg_termes: FormGroup;
  fg_items: FormGroup;
  fg_ventilation: FormGroup;
  fg_commentaire: FormGroup;

  buildFormGroups() {
    this.fg_commande = new FormGroup({
      entente: new FormControl(this.commande.entente, Validators.required),
      standard: new FormControl(this.commande.standard, Validators.required),
    });
    this.fg_finances = new FormGroup({
      technique: new FormControl(this.finances.technique, Validators.required),
      commande: new FormControl(this.finances.commande, Validators.required),
    });
    this.fg_demandeur = new FormGroup({
      nom: new FormControl(this.demandeur.nom, Validators.required),
      telephone: new FormControl(this.demandeur.telephone, [Validators.required, Validators.pattern(PhoneRegex)]),
      departement: new FormControl(this.demandeur.departement, Validators.required),
    });
    this.fg_fournisseur = new FormGroup({
      nom: new FormControl(this.fournisseur.nom, Validators.required),
      telephone: new FormControl(this.fournisseur.telephone, [Validators.required, Validators.pattern(PhoneRegex)]),
      adresse: new FormControl(this.fournisseur.adresse, Validators.required),
      fax: new FormControl(this.fournisseur.fax, Validators.pattern(PhoneRegex)),
      ville: new FormControl(this.fournisseur.ville, Validators.required),
      province: new FormControl(this.fournisseur.province, Validators.required),
      postal: new FormControl(this.fournisseur.postal, Validators.required),
      pays: new FormControl(this.fournisseur.pays, Validators.required),
    });
    this.fg_contact = new FormGroup({
      nom: new FormControl(this.contact.nom, Validators.required),
      courriel: new FormControl(this.contact.courriel, Validators.email),
      telephone: new FormControl(this.contact.telephone, Validators.pattern(PhoneRegex)),
      fax: new FormControl(this.contact.fax, Validators.pattern(PhoneRegex)),
    });
    this.fg_soumission = new FormGroup({
      numero: new FormControl(this.soumission.numero, Validators.required),
      echeance: new FormControl(this.soumission.echeance, Validators.required),
    });
    this.fg_livraison = new FormGroup({
      date: new FormControl(this.livraison.date, Validators.required),
      lieu: new FormControl(this.livraison.lieu, Validators.required),
      incoterms: new FormControl(this.livraison.incoterms /*!!??*/),
    });
    this.fg_termes = new FormGroup({
      conditions: new FormControl(this.termes.conditions, Validators.required),
      moyens: new FormControl(this.termes.moyens, Validators.required),
      precisions: new FormControl(this.termes.precisions, Validators.required),
    });
    this.fg_items = new FormGroup({}, (form) => {
      const res: any = {};
      let valid = true;
      let negative = false;
      let error = false;
      this.items.tableau.forEach(line => {
        valid = valid && (line.quant === 0 && line.prixUnit === 0) || !(line.descr === '');
        negative = negative || (line.quant < 0 || line.prixUnit < 0);
      });
      if (!valid) {
        res.incomplete = true;
        error = true;
      }
      if (negative) {
        res.negative = true;
        error = true;
      }
      if (error) {
        return res;
      } else {
        return null;
      }
    });
    this.fg_ventilation = new FormGroup({}, (form) => {
      const res: any = {};
      let valid = true;
      let error = false;
      let negative = false;
      this.ventilation.tableau.forEach(line => {
        valid = valid && line.montant === 0 || !(line.ubr === '' || line.unite === '' || line.compte === '');
        negative = negative || (line.montant < 0);
      });
      if (!valid) {
        res.incomplete = true;
        error = true;
      }
      if (negative) {
        res.negative = true;
        error = true;
      }
      if (error) {
        return res;
      } else {
        return null;
      }
    });
    this.fg_commentaire = new FormGroup({
      value: new FormControl(this.commentaire.value),
    });

    // Fill the control array
    while (this.controls.length !== 0) { this.controls.controls.pop(); }
    this.controls.push(this.fg_commande);
    this.controls.push(this.fg_finances);
    this.controls.push(this.fg_demandeur);
    this.controls.push(this.fg_fournisseur);
    this.controls.push(this.fg_contact);
    this.controls.push(this.fg_soumission);
    this.controls.push(this.fg_livraison);
    this.controls.push(this.fg_termes);
    this.controls.push(this.fg_items);
    this.controls.push(this.fg_ventilation);
    this.controls.push(this.fg_commentaire);
    // this.controls.push(this.fg_remarques);
  }
}

