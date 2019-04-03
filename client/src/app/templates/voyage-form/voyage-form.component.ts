import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import { Signature, ISignature } from '../fields';
import { BaseFormComponent } from '../base-form.component';

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
    this.avanceTotal = this.avances.avance1 + this.avances.avance2;
  }

  updateTotal() {
    this.ventilationTotal = 0;
    this.ventilation.tableau.forEach(element => {
      this.ventilationTotal += element.montant;
    });
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
    for (let i = 0; i < this.ventilation.tableau.length; i++) {
      if (this.ventilation[i].id === value) {
          this.ventilation.tableau.splice(i, 1);
      }
    }
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }

  ngOnInit() {
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
    this.endroit_deplacement.au = new Date(this.endroit_deplacement.au);
    this.endroit_deplacement.du = new Date(this.endroit_deplacement.du);
    this.bothFilled = (this.endroit_deplacement.au !== null && this.endroit_deplacement.du !== null);
    if (this.bothFilled) {
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
}
