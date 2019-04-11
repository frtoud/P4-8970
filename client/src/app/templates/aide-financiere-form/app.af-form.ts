import { Component } from '@angular/core';
import {MatFormFieldModule, MatGridListModule, MatTableDataSource} from '@angular/material';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup} from '@angular/forms';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';
import { Signature, ISignature } from '../fields';
import { BaseFormComponent } from '../base-form.component';
import { TestPositive } from '../common_validator';

export interface IAideFinanciere {

  // DEMANDEUR
  demandeur: {
    id: string;
    assigneA: string;

    nom: string;
    telephone: string;
    centre: string;
    admin: string;
  };

  // BENEFICIAIRE
  beneficiaire: {
    id: string;
    assigneA: string;

    nom: string;
    prenom: string;
    mat_etudiant: string;
    mat_enseignant: string;
  };


  // CYCLE DE L'ETUDIANT
  cycle: {
    id: string;
    assigneA: string;

    bac: boolean;
    bacec: boolean;
    mai: boolean;
    maiec: boolean;
    doc: boolean;
    docec: boolean;
  };


  // DETAILS
  details: {
    id: string;
    assigneA: string;

    date_debut: Date;
    date_fin: Date;
    statutVersement: string;
    num_ref: string;
    montant: number;
    subventionnaire: string;
  };


  // Ventilation
  ventilation: {
    id: string;
    assigneA: string;

    tableau: IVentilationAF[];
  };

  remarques: {
    id: string;
    assigneA: string;

    value: string;
  };

  signatures: ISignature[];

}
export interface IVentilationAF {
  id: number;
  ubr: string;
  compte: string;
  unite: string;
  percent: number;
  montant: number;
}

@Component({
  selector: 'app-af-form',
  templateUrl: './app.af-form.html',
  styleUrls: ['./app.af-form.css']
})
export class AFFormComponent extends BaseFormComponent implements IAideFinanciere {

  // DEMANDEUR
  demandeur = {
    id: 'demandeur',
    assigneA: null,
    nom : '',
    telephone : '',
    centre : '',
    admin : '',
  };

  // BENEFICIAIRE
  beneficiaire = {
    id: 'beneficiaire',
    assigneA: null,
    nom : '',
    prenom : '',
    mat_etudiant : '',
    mat_enseignant : '',
  };

  // CYCLE DE L'ETUDIANT
  cycle = {
    id: 'cycle',
    assigneA: null,

    bac: false,
    bacec: false,
    mai: false,
    maiec: false,
    doc: false,
    docec: false,
  };

  // DETAILS
  details = {
    id: 'details',
    assigneA: null,

    date_debut: undefined,
    date_fin: undefined,
    statutVersement: '',
    num_ref: '',
    montant: 0,
    subventionnaire: '',
  };
  ventilation = {
    id: 'ventilation',
    assigneA: null,

    tableau: [
      {id: 0, ubr: '', compte: '', unite: '', percent: 0, montant: 0, },
      {id: 1, ubr: '', compte: '', unite: '', percent: 0, montant: 0, },
      {id: 2, ubr: '', compte: '', unite: '', percent: 0, montant: 0, },
    ],
  };
  remarques = {
    id: 'remarques',
    assigneA: null,

    value: '',
  };
  signatures = [
    new Signature('sig-boursier', 'SIGNATURE DU BOURSIER', null, '', false, false, false),
    new Signature('sig-titulaire', 'SIGNATURE DU (DES) TITULAIRES(S) DE SUBVENTION', null, '', false, false, false),
    new Signature('sig-autorise', 'SIGNATURE(S) AUTORISÉE(S)', null, '', false, false, false),
    new Signature('sig-finances', 'SERVICE DES FINANCES', null, '', false, false, false),
  ];
  ventilationTotal = 0;

  dSventilation = new MatTableDataSource(this.ventilation.tableau);
  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'percent', 'montant', 'action'];

  matriculesValide = false;

  onChangeStatus() {
    const control = this.fg_details.get('num_ref');
    if (this.fg_details.get('statutVersement').value === 'CHANGE') {
      control.enable();
    } else {
      control.disable();
    }
  }
  updateTotal() {
    this.ventilationTotal = 0;
    this.ventilation.tableau.forEach(element => {
      this.ventilationTotal += element.montant;
    });
    this.fg_ventilation.updateValueAndValidity();
  }
  onCreate() {
    const id = BaseFormComponent.getHighestId(this.ventilation.tableau) + 1;
    this.ventilation.tableau.push(
      {id: id, ubr: '', compte: '', unite: '', percent: 0, montant: 0, }
    );
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }
  onDelete(value) {
    const index: number = this.ventilation.tableau.findIndex((el: any) => el.id === value.id);
    if (index >= 0) {
      this.ventilation.tableau.splice(index, 1);
    }

    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }
  testMatricule() {
    this.matriculesValide = this.beneficiaire.mat_enseignant.length === 0 && this.beneficiaire.mat_etudiant.length === 0;
  }

  // BASECLASS FUNCTIONS

  setSections() {
  this.sections = [
      this.demandeur, this.beneficiaire, this.cycle, this.details, this.ventilation, this.remarques
    ];
    this.dSventilation = new MatTableDataSource(this.ventilation.tableau);
  }

  initCalculs() {
    this.updateTotal();
    this.testMatricule();
    }

    fg_demandeur: FormGroup;
    fg_beneficiaire: FormGroup;
    fg_cycle: FormGroup;
    fg_details: FormGroup;
    fg_ventilation: FormGroup;
    fg_remarques: FormGroup;

    buildFormGroups() {
      this.fg_demandeur = new FormGroup({
        nom: new FormControl(this.demandeur.nom, Validators.required),
        telephone: new FormControl(this.demandeur.telephone, Validators.required),
        centre: new FormControl(this.demandeur.centre, Validators.required),
        admin: new FormControl(this.demandeur.admin, Validators.required),
      });
      this.fg_beneficiaire = new FormGroup({
        nom: new FormControl(this.beneficiaire.nom, Validators.required),
        prenom: new FormControl(this.beneficiaire.prenom, Validators.required),
        mat_enseignant: new FormControl(this.beneficiaire.mat_enseignant),
        mat_etudiant: new FormControl(this.beneficiaire.mat_etudiant),
      }, (form) => { // At least one
        return (form.value.mat_enseignant !== '' || form.value.mat_etudiant !== '') ? null : { matricules: true };
       });
      this.fg_cycle = new FormGroup({
        bac: new FormControl(this.cycle.bac),
        bacec: new FormControl(this.cycle.bacec),
        mai: new FormControl(this.cycle.mai),
        maiec: new FormControl(this.cycle.maiec),
        doc: new FormControl(this.cycle.doc),
        docec: new FormControl(this.cycle.docec),
      }, (form) => { // At least one
         return form.value.bac || form.value.bacec
             || form.value.mai || form.value.maiec
             || form.value.doc || form.value.docec ? null : { invalid: true };
        });
      this.fg_details = new FormGroup({
        date_debut: new FormControl(this.details.date_debut, Validators.required),
        date_fin: new FormControl(this.details.date_fin, Validators.required),
        statutVersement: new FormControl(this.details.statutVersement, Validators.required),
        num_ref: new FormControl({value: this.details.num_ref, disabled: this.details.statutVersement !== 'CHANGE'}, Validators.required),
        montant: new FormControl(this.details.montant, [Validators.required, TestPositive]),
        subventionnaire: new FormControl(this.details.subventionnaire, Validators.required),
      }, (form) => {
        if (form.value.date_debut && form.value.date_fin && form.value.date_fin < form.value.date_debut){
          return { dates: true };
        } else {
          return null;
        }
      });
      this.fg_ventilation = new FormGroup({}, (form) => {
        const res: any = {};
        let valid = true;
        let negative = false;
        let error = false;
        this.ventilation.tableau.forEach(line => {
          valid = valid && line.montant === 0 || !(line.ubr === '' || line.unite === '' || line.compte === '');
          negative = negative || line.montant < 0;
        });
        // Total égal au montant précédemment spécifié
        if (this.ventilationTotal !== this.fg_details.value.montant) {
          res.total = true;
          error = true;
        }
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
      this.fg_remarques = new FormGroup({
        value: new FormControl(this.remarques.value),
      });

      // Fill the control array
      while (this.controls.length !== 0) { this.controls.controls.pop(); }
      this.controls.push(this.fg_demandeur);
      this.controls.push(this.fg_beneficiaire);
      this.controls.push(this.fg_cycle);
      this.controls.push(this.fg_ventilation);
      this.controls.push(this.fg_details);
      this.controls.push(this.fg_remarques);
    }

}
