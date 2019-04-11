import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { Signature, ISignature } from '../fields';
import { BaseFormComponent } from '../base-form.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface IVoyageForm {
  entite_employe:
  {
    id: string;
    assigneA: string;

    matricule: string;
  };
  entite_fournisseur:
  {
    id: string;
    assigneA: string;

    numero: string;
    adresse: string;
  };

  beneficiaire:
  {
    id: string;
    assigneA: string;

    nom: string;
  };
  demandeur:
  {
    id: string;
    assigneA: string;

    nom: string;
    telephone: string;
  };

  fournisseur:
  {
    id: string;
    assigneA: string;

    adresse: string;
    ville: string;
    province: string;
    postal: string;
    telephone: string;
    fax: string;
  };

  endroit_deplacement:
  {
    id: string;
    assigneA: string;

    endroit: string;
    du: Date;
    au: Date;
  };
  but_deplacement:
  {
    id: string;
    assigneA: string;

    raison: string;
  };
  estimation:
  {
    id: string;
    assigneA: string;

    fraisInscription: number ;
    transport: number;
    sejour: number;
    autres: number;
  };

  ventilation: {
    id: string;
    assigneA: string;

    tableau: IVentilationA[];
  };

  avances: {
    id: string;
    assigneA: string;

    avance1: number;
    avance2: number;
    date1: Date;
    date2: Date;
  };

  signatures: ISignature[];
}

export interface IVentilationA {
  id: number;
  ubr: string;
  compte: string;
  unite: string;
  montant: number;
}

@Component({
// tslint:disable-next-line: component-selector
  selector: 'voyage-form',
  templateUrl: './voyage-form.component.html',
  styleUrls: ['./voyage-form.component.css']
})
export class VoyageFormComponent extends BaseFormComponent implements IVoyageForm, OnInit, AfterViewInit {

  entite_employe =
  {
    id: 'entite_employe',
    assigneA: null,

    matricule: '',
  };
  entite_fournisseur =
  {
    id: 'entite_fournisseur',
    assigneA: null,

    numero: '',
    adresse: '',
  };

  beneficiaire =
  {
    id: 'beneficiaire',
    assigneA: null,

    nom: '',
  };
  demandeur =
  {
    id: 'demandeur',
    assigneA: null,

    nom: '',
    telephone: '',
  };

  fournisseur =
  {
    id: 'fournisseur',
    assigneA: null,

    adresse: '',
    ville: '',
    province: '',
    postal: '',
    telephone: '',
    fax: '',
  };

  endroit_deplacement =
  {
    id: 'endroit_deplacement',
    assigneA: null,

    endroit: '',
    du: null,
    au: null,
  };
  but_deplacement =
  {
    id: 'but_deplacement',
    assigneA: null,

    raison: '',
  };
  estimation =
  {
    id: 'estimation',
    assigneA: null,

    fraisInscription: 0,
    transport: 0,
    sejour: 0,
    autres: 0,
  };

  ventilation = {
    id: 'ventilation',
    assigneA: null,

    tableau: [
      {id: 0, ubr: '', compte: '', unite: '', montant: 0 },
      {id: 1, ubr: '', compte: '', unite: '', montant: 0 },
      {id: 2, ubr: '', compte: '', unite: '', montant: 0 },
    ],
  };

  avances = {
    id: 'avances',
    assigneA: null,

    avance1: 0,
    avance2: 0,
    date1: null,
    date2: null,
  };

  signatures = [
    new Signature('sig-demandeur', 'SIGNATURE DU DEMANDEUR', null, '', false, false, false),
    new Signature('sig-ubr', 'SIGNATURE DU (DES) RESPONSABLES(S) DE L\'UBR', null, '', false, false, false),
    new Signature('sig-superieur', 'SIGNATURE DU SUPÉRIEUR IMMÉDIAT', null, '', false, false, false),
    new Signature('sig-finances', 'SERVICE DES FINANCES', null, '', false, false, false),
  ];

  private dureeDeplacement = 0;
  private bothFilled = false;

  private avanceTotal = 0;

  private estimationTotal = 0;

  montant = 0;
  ventilationTotal = 0;

  currency = ['CAN', 'US', 'EURO', 'GBP', 'CHF', 'BRL'];
  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'montant', 'action'];

  dSventilation = new MatTableDataSource(this.ventilation.tableau);

  updateAvanceTotal() {
    const a1 = this.fg_avances.get('avance1');
    const a2 = this.fg_avances.get('avance2');
    const d1 = this.fg_avances.get('date1');
    const d2 = this.fg_avances.get('date2');
    this.avanceTotal = a1.value + a2.value;
    if (a1.value <= 0 ) { d1.disable(); } else { d1.enable(); }
    if (a2.value <= 0 ) { d2.disable(); } else { d2.enable(); }
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
      {id: id, ubr: '', compte: '', unite: '', montant: 0 }
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

  private duChange(str: any): void {
    this.endroit_deplacement.du = str;
    this.updateDuree();
  }

  private auChange(str: any): void {
    this.endroit_deplacement.au = str;
    this.updateDuree();
  }

  private updateDuree(): void {
    if (this.endroit_deplacement.au == null && this.endroit_deplacement.du == null) {
      return;
    }

    this.bothFilled = (this.endroit_deplacement.au !== null && this.endroit_deplacement.du !== null);
    if (this.bothFilled) {
      this.endroit_deplacement.au = new Date(this.endroit_deplacement.au);
      this.endroit_deplacement.du = new Date(this.endroit_deplacement.du);
      this.dureeDeplacement = this.endroit_deplacement.au.valueOf() - this.endroit_deplacement.du.valueOf();
      this.dureeDeplacement = Math.round((((this.dureeDeplacement / 60) / 60) / 24) / 1000);
    }
  }

  private updateFraisInscription(frais: number): void {
    this.estimation.fraisInscription = frais;
    this.updateEstimationTotal();
  }

  private updateTransport(frais: number): void {
    this.estimation.transport = frais;
    this.updateEstimationTotal();
  }

  private updateSejour(frais: number): void {
    this.estimation.sejour = frais;
    this.updateEstimationTotal();
  }

  private updateAutres(frais: number): void {
    this.estimation.autres = frais;
    this.updateEstimationTotal();
  }

  private updateEstimationTotal(): void {
    this.estimationTotal = this.estimation.fraisInscription + this.estimation.transport
     + this.estimation.sejour + this.estimation.autres;
  }

    setSections() {
    this.sections = [
      this.beneficiaire, this.entite_employe, this.entite_fournisseur, this.ventilation, // this.demandeur,
      this.fournisseur, this.endroit_deplacement, this.but_deplacement, this.estimation, this.avances,
    ];
    this.dSventilation = new MatTableDataSource(this.ventilation.tableau);
    }

  initCalculs() {
    this.updateDuree();
    this.updateAvanceTotal();
    this.updateEstimationTotal();
    this.updateTotal();
  }

  fg_entite_employe: FormGroup;
  fg_entite_fournisseur: FormGroup;
  fg_beneficiaire: FormGroup;
  fg_fournisseur: FormGroup;
  fg_endroit_deplacement: FormGroup;
  fg_but_deplacement: FormGroup;
  fg_estimation: FormGroup;
  fg_ventilation: FormGroup;
  fg_avances: FormGroup;

  buildFormGroups() {
    this.fg_entite_employe = new FormGroup({
      matricule: new FormControl(this.entite_employe.matricule, Validators.required),
    });
    this.fg_entite_fournisseur = new FormGroup({
      numero: new FormControl(this.entite_fournisseur.numero, Validators.required),
      adresse: new FormControl(this.entite_fournisseur.adresse, Validators.required),
    });
    this.fg_beneficiaire = new FormGroup({
      nom: new FormControl(this.beneficiaire.nom, Validators.required),
    });
    this.fg_fournisseur = new FormGroup({
      adresse: new FormControl(this.fournisseur.adresse, Validators.required),
      telephone: new FormControl(this.fournisseur.telephone, Validators.required),
      fax: new FormControl(this.fournisseur.fax, Validators.required),
      ville: new FormControl(this.fournisseur.ville, Validators.required),
      province: new FormControl(this.fournisseur.province, Validators.required),
      postal: new FormControl(this.fournisseur.postal, Validators.required),
    });
    this.fg_endroit_deplacement = new FormGroup({
      endroit: new FormControl(this.endroit_deplacement.endroit, Validators.required),
      du: new FormControl(this.endroit_deplacement.du, Validators.required),
      au: new FormControl(this.endroit_deplacement.au, Validators.required),
    }, (form) => {
      this.endroit_deplacement.du = form.value.du;
      this.endroit_deplacement.au = form.value.au;
      this.updateDuree();
      if (this.dureeDeplacement < 0) { return { duree : true};
      } else { return null; }
    });
    this.fg_but_deplacement = new FormGroup({
      raison: new FormControl(this.but_deplacement.raison),
    });
    this.fg_estimation = new FormGroup({
      fraisInscription: new FormControl(this.estimation.fraisInscription, Validators.required),
      transport: new FormControl(this.estimation.transport, Validators.required),
      sejour: new FormControl(this.estimation.sejour, Validators.required),
      autres: new FormControl(this.estimation.autres, Validators.required),
    });
    this.fg_ventilation = new FormGroup({}, (form) => {
      const res: any = {};
      let valid = true;
      let error = false;
      this.ventilation.tableau.forEach(line => {
        valid = valid && line.montant === 0 || !(line.ubr === '' || line.unite === '' || line.compte === '');
      });
      if (!valid) {
        res.incomplete = true;
        error = true;
      }
      if (error) {
        return res;
      } else {
        return null;
      }
    });
    this.fg_avances = new FormGroup({
      avance1: new FormControl(this.avances.avance1, Validators.required),
      date1: new FormControl(this.avances.date1, Validators.required),
      avance2: new FormControl(this.avances.avance2, Validators.required),
      date2: new FormControl(this.avances.date2, Validators.required),
    });

    // Fill the control array
    while (this.controls.length !== 0) { this.controls.controls.pop(); }
    this.controls.push(this.fg_entite_employe);
    this.controls.push(this.fg_entite_fournisseur);
    this.controls.push(this.fg_beneficiaire);
    this.controls.push(this.fg_fournisseur);
    this.controls.push(this.fg_endroit_deplacement);
    this.controls.push(this.fg_but_deplacement);
    this.controls.push(this.fg_estimation);
    this.controls.push(this.fg_avances);
    this.controls.push(this.fg_ventilation);
  }
}
