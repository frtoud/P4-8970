import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { Signature, ISignature } from '../fields';
import { BaseFormComponent } from '../base-form.component';
import { IAnnexRow, AnnexeComponent, AnnexRowData } from '../annexe/annexe.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PhoneRegex, TestPositive } from '../common_validator';

export interface IVentilationRD {
  id: number;
  ubr: string;
  compte: string;
  unite: string;
  montant: number;
  code: string;
  commentaire: string;
}

export interface IDeplacementForm {
  entite_externe:
  {
    id:  string;
    assigneA:  string;

    nom: string;
    matricule:  string;
    statut:  string;
    adresse:  string;
    telephone:  string;
    institut:  string;
  };
  endroit_duree:
  {
    id: string;
    assigneA: string;

    endroit: string;
    du:  Date;
    au:  Date;
  };

  but:
  {
    id:  string;
    assigneA: string;

    valeur: string;
  };

  ventilation:
  {
    id: string;
    assigneA: string;

    tableau: IVentilationRD[];

    recu: number;
    paiement: number;
    remboursement: number;
  };

  signatures: ISignature[];

  annexe: {
    id: string;
    assigneA: string;

    tableau: IAnnexRow[];

    accQC: string,
    accHQC: string,
  };
}

@Component({
  selector: 'app-form-deplacement',
  templateUrl: './form-deplacement.component.html',
  styleUrls: ['./form-deplacement.component.css']
})
export class FormDeplacementComponent extends BaseFormComponent implements IDeplacementForm, OnInit {
  @ViewChild(AnnexeComponent) annexeComp: AnnexeComponent;

  currency = ['CAD', 'USD', 'EUR', 'GBP', 'CHF', 'BRL'];

  entite_externe =
  {
    id: 'entite_externe',
    assigneA: null,

    nom: '',
    matricule: '',
    statut: '',
    adresse: '',
    telephone: '',
    institut: '',
  };
  endroit_duree =
  {
    id: 'endroit_duree',
    assigneA: null,

    endroit: '',
    du: null,
    au: null,
  };

  but =
  {
    id: 'but',
    assigneA: null,

    valeur: '',
  };

  ventilation =
  {
    id: 'ventilation',
    assigneA: null,

    tableau: [
    {id: 0, ubr: '', compte: '', unite: '', montant: 0, code: '', commentaire: '' },
    {id: 1, ubr: '', compte: '', unite: '', montant: 0, code: '', commentaire: '' },
    {id: 2, ubr: '', compte: '', unite: '', montant: 0, code: '', commentaire: '' },
    ],

    recu: 0,
    paiement: 0,
    remboursement: 0,
  };

  signatures = [
    new Signature('sig-demandeur', 'SIGNATURE DU DEMANDEUR', null, '', false, false, false),
    new Signature('sig-ubr', 'SIGNATURE DU (DES) RESPONSABLES(S) DE L\'UBR', null, '', false, false, false),
    new Signature('sig-superieur', 'SIGNATURE DU SUPÉRIEUR IMMÉDIAT', null, '', false, false, false),
    new Signature('sig-finances', 'SERVICE DES FINANCES', null, '', false, false, false),
  ];

  annexe = {
    id: 'annexe',
    assigneA: null,

    tableau: [
      { id: 0, date: null, description: '', ref: '',
        perdiem: 0, nbKm: 0, pers: false, fraisKm: 0,
        chambreST: 0, fraisRecMoins: 0, fraisRecPlus: 0,
        fourniture: 0, inscription: 0, qcHqc: 'QC',
        montant: 0, fournitureMateriel: false, plusDeCinq: false, }
    ],

    accQC: '',
    accHQC: '',
  };

  private dureeDeplacement = 0;
  private bothFilled = false;

  montant = 0;
  ventilationTotal = 0;

  nomDemandeur = '';
  demandeurChecked = false;
  signatureAdded = false;

  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'montant', 'code', 'commentaire', 'action'];

  dSventilation = new MatTableDataSource(this.ventilation.tableau);

  updateTotal() {
    this.ventilationTotal = 0;
    this.ventilation.tableau.forEach(element => {
      this.ventilationTotal += element.montant;
    });
    this.fg_ventilation.updateValueAndValidity();
  }

  onCreate() {
    const id = BaseFormComponent.getHighestId(this.ventilation.tableau);
    this.ventilation.tableau.push(
      {id: id, ubr: '', compte: '', unite: '', montant: 0, code: '', commentaire: '' }
    );
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }

  onDelete(value) {
    for (let i = 0; i < this.ventilation.tableau.length; i++) {
      if (this.ventilation.tableau[i].id === value) {
          this.ventilation.tableau.splice(i, 1);
      }
    }
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }

  onRecalcul() {
    // clear
    while (this.ventilation.tableau.length > 0 ) { this.ventilation.tableau.pop(); }

    // My head, it burns
    if (this.annexeComp.ventTotalQC.perdiem > 0) { this.ventilation.tableau.push(
      {id: 0, ubr: '', compte: '30101', unite: '', montant: this.annexeComp.ventTotalQC.perdiem, code: '22', commentaire: '' }); }
    if (this.annexeComp.ventTotalQC.fraisKm > 0) { this.ventilation.tableau.push(
      {id: 1, ubr: '', compte: '30107', unite: '', montant: this.annexeComp.ventTotalQC.fraisKm, code: '22', commentaire: '' }); }
    if (this.annexeComp.ventTotalQC.chambreST > 0) { this.ventilation.tableau.push(
      {id: 2, ubr: '', compte: '30113', unite: '', montant: this.annexeComp.ventTotalQC.chambreST, code: '44', commentaire: '' }); }
    if (this.annexeComp.ventTotalQC.fraisRecMoins > 0) { this.ventilation.tableau.push(
      {id: 3, ubr: '', compte: '30201', unite: '', montant: this.annexeComp.ventTotalQC.fraisRecMoins, code: '44', commentaire: '' }); }
    if (this.annexeComp.ventTotalQC.fraisRecPlus > 0) { this.ventilation.tableau.push(
      {id: 4, ubr: '', compte: '30203', unite: '', montant: this.annexeComp.ventTotalQC.fraisRecPlus, code: '44', commentaire: '' }); }
    if (this.annexeComp.ventTotalQC.fourniture > 0) { this.ventilation.tableau.push(
      {id: 5, ubr: '', compte: '40303', unite: '', montant: this.annexeComp.ventTotalQC.fourniture, code: '22', commentaire: '' }); }

    if (this.annexeComp.ventTotalHQC.perdiem > 0) { this.ventilation.tableau.push(
      {id: 6, ubr: '', compte: '30104', unite: '', montant: this.annexeComp.ventTotalHQC.perdiem, code: '20', commentaire: '' }); }
    if (this.annexeComp.ventTotalHQC.fraisKm > 0) { this.ventilation.tableau.push(
      {id: 7, ubr: '', compte: '30110', unite: '', montant: this.annexeComp.ventTotalHQC.fraisKm, code: '20', commentaire: '' }); }
    if (this.annexeComp.ventTotalHQC.chambreST > 0) { this.ventilation.tableau.push(
      {id: 8, ubr: '', compte: '30116', unite: '', montant: this.annexeComp.ventTotalHQC.chambreST, code: '40', commentaire: '' }); }
    if (this.annexeComp.ventTotalHQC.fraisRecMoins > 0) { this.ventilation.tableau.push(
      {id: 9, ubr: '', compte: '30206', unite: '', montant: this.annexeComp.ventTotalHQC.fraisRecMoins, code: '40', commentaire: '' }); }
    if (this.annexeComp.ventTotalHQC.fraisRecPlus > 0) { this.ventilation.tableau.push(
      {id: 10, ubr: '', compte: '30204', unite: '', montant: this.annexeComp.ventTotalHQC.fraisRecPlus, code: '40', commentaire: '' }); }
    if (this.annexeComp.ventTotalHQC.fourniture > 0) { this.ventilation.tableau.push(
      {id: 11, ubr: '', compte: '40328', unite: '', montant: this.annexeComp.ventTotalHQC.fourniture, code: '20', commentaire: '' }); }

    if (this.annexeComp.ventTotalHCA.montant > 0) { this.ventilation.tableau.push(
      {id: 12, ubr: '', compte: '30119', unite: '', montant: this.annexeComp.ventTotalHCA.montant, code: '00', commentaire: '' }); }
    if (this.annexeComp.ventTotalHCA.personne > 0) { this.ventilation.tableau.push(
      {id: 13, ubr: '', compte: '30205', unite: '', montant: this.annexeComp.ventTotalHCA.personne, code: '00', commentaire: '' }); }
    if (this.annexeComp.ventTotalHCA.fourniture > 0) { this.ventilation.tableau.push(
      {id: 14, ubr: '', compte: '40329', unite: '', montant: this.annexeComp.ventTotalHCA.fourniture, code: '00', commentaire: '' }); }

    if (this.annexeComp.ventTotalQC.inscription > 0 && this.fg_annexe.value.accQC !== '') { this.ventilation.tableau.push(
      {id: 15, ubr: '', compte: this.fg_annexe.value.accQC, unite: '',
      montant: this.annexeComp.ventTotalQC.inscription, code: '00', commentaire: '' }); }
    if (this.annexeComp.ventTotalHQC.inscription > 0 && this.fg_annexe.value.accHQC !== '') { this.ventilation.tableau.push(
      {id: 16, ubr: '', compte: this.fg_annexe.value.accHQC, unite: '',
      montant: this.annexeComp.ventTotalHQC.inscription, code: '00', commentaire: '' }); }

    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
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
    if (this.endroit_duree.au == null && this.endroit_duree.du == null) {
      return;
    }

    this.bothFilled = (this.endroit_duree.au !== null && this.endroit_duree.du !== null);
    if (this.bothFilled) {
      this.endroit_duree.au = new Date(this.endroit_duree.au);
      this.endroit_duree.du = new Date(this.endroit_duree.du);
      this.dureeDeplacement = this.endroit_duree.au.valueOf() - this.endroit_duree.du.valueOf();
      this.dureeDeplacement = Math.round((((this.dureeDeplacement / 60) / 60) / 24) / 1000);
    }
  }

    setSections(): void {
      // Sent to annex by reference
      this.annexeComp.setAnnexe(this.annexe);

      this.sections = [
      this.entite_externe, this.ventilation,
      this.annexe, this.endroit_duree, this.but,
    ];
    this.dSventilation = new MatTableDataSource(this.ventilation.tableau);
    }

    initCalculs() {
      this.updateDuree();
      this.updateTotal();
    }

  fg_entite_externe: FormGroup;
  fg_endroit_duree: FormGroup;
  fg_but: FormGroup;
  fg_ventilation: FormGroup;
  fg_annexe: FormGroup;

  buildFormGroups() {
    this.fg_entite_externe = new FormGroup({
      nom: new FormControl(this.entite_externe.nom, Validators.required),
      matricule: new FormControl(this.entite_externe.matricule, Validators.required),
      adresse: new FormControl(this.entite_externe.adresse, Validators.required),
      telephone: new FormControl(this.entite_externe.telephone, [Validators.required, Validators.pattern(PhoneRegex)]),
      institut: new FormControl(this.entite_externe.institut, Validators.required),
      statut: new FormControl(this.entite_externe.statut, Validators.required),
    });
    this.fg_endroit_duree = new FormGroup({
      endroit: new FormControl(this.endroit_duree.endroit, Validators.required),
      du: new FormControl(this.endroit_duree.du, Validators.required),
      au: new FormControl(this.endroit_duree.au, Validators.required),
    }, (form) => {
      this.endroit_duree.du = form.value.du;
      this.endroit_duree.au = form.value.au;
      this.updateDuree();
      if (this.dureeDeplacement < 0) { return { duree : true};
      } else { return null; }
    });
    this.fg_but = new FormGroup({
      valeur: new FormControl(this.but.valeur, Validators.required),
    });
    this.fg_ventilation = new FormGroup({
      recu: new FormControl(this.ventilation.recu, [Validators.required, TestPositive]),
      paiement: new FormControl(this.ventilation.paiement, [Validators.required, TestPositive]),
      remboursement: new FormControl(this.ventilation.remboursement, [Validators.required, TestPositive]),
    }, [(form) => {
      const res: any = {};
      let negative = false;
      let valid = true;
      let error = false;
      this.ventilation.tableau.forEach(line => {
        valid = valid && line.montant === 0 || !(line.ubr === '' || line.code === '' || line.unite === '' || line.compte === '');
        negative = negative || line.montant < 0;
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
    }, (form) => {
      return this.ventilationTotal !== this.annexeComp.totalDuRapport ?
      { difference: this.annexeComp.totalDuRapport - this.ventilationTotal } : null;
    }]);
    this.fg_annexe = new FormGroup({
      accQC: new FormControl(this.annexe.accQC),
      accHQC: new FormControl(this.annexe.accHQC),
    }, (form) => {
      const res: any = {};
      let negative = false;
      let valid = true;
      let error = false;
      this.annexe.tableau.forEach(line => {
        valid = valid && (line.montant === 0 && line.perdiem === 0 && line.fraisKm === 0 && line.chambreST === 0
         && line.fraisRecMoins === 0 && line.fraisRecPlus === 0 && line.fourniture === 0 && line.inscription === 0)
         || !(line.date === null || line.description === '' || line.ref === '');
        negative = negative || (line.montant < 0 || line.perdiem < 0 || line.fraisKm < 0 || line.chambreST < 0
          || line.fraisRecMoins < 0 || line.fraisRecPlus < 0 || line.fourniture < 0 || line.inscription < 0);
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
    this.annexeComp.formcontrol = this.fg_annexe;

    // Fill the control array
    while (this.controls.length !== 0) { this.controls.controls.pop(); }
    this.controls.push(this.fg_entite_externe);
    this.controls.push(this.fg_endroit_duree);
    this.controls.push(this.fg_but);
    this.controls.push(this.fg_ventilation);
    this.controls.push(this.fg_annexe);
  }
}
