import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ExchangeRateService } from '../../services/exchangeRate.service';
import { BaseFormComponent } from '../base-form.component';
import { ISignature, Signature } from '../fields';
import { FormGroup, FormControl, Validators } from '@angular/forms';

export interface IPaymentForm {

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

  description_facture:
  {
    id: string;
    assigneA: string;

    tableau: Bill[];
  };

  ventilation_budgetaire:
  {
    id: string;
    assigneA: string;

    tableau: IVentilationDP[];
  };

  signatures: ISignature[];
}

export interface IVentilationDP {
  id: number;
  ubr: string;
  compte: string;
  unite: string;
  code: string;
  t4a: string;
  reference: string;
  montant: number;
}

@Component({
// tslint:disable-next-line: component-selector
  selector: 'payment-form',
  templateUrl: './paymentForm.component.html',
  styleUrls: ['./paymentForm.component.css']
})
export class PaymentFormComponent extends BaseFormComponent implements IPaymentForm {

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
  description_facture =
  {
    id: 'description_facture',
    assigneA: null,

    tableau: [{ id: 0, num: '', description: '', reference: '', total: 0 }],
  };

    ventilation_budgetaire =
    {
      id: 'ventilation_budgetaire',
      assigneA: null,

      tableau: [{id: 0, ubr: '', compte: '', unite: '', code: '', t4a: '', reference: '', montant: 0}],
    };

  signatures = [
    new Signature('sig-demandeur', 'SIGNATURE DU DEMANDEUR', null, '', false, false, false),
    new Signature('sig-ubr', 'SIGNATURE DU (DES) RESPONSABLES(S) DE L\'UBR', null, '', false, false, false),
    new Signature('sig-superieur', 'SIGNATURE DU SUPÉRIEUR IMMÉDIAT', null, '', false, false, false),
    new Signature('sig-finances', 'SERVICE DES FINANCES', null, '', false, false, false),
  ];
    currency = ['CAD', 'USD', 'EUR', 'GBP', 'CHF', 'BRL'];

    dsFactures = new MatTableDataSource(this.description_facture.tableau);
    dsVentilation = new MatTableDataSource(this.ventilation_budgetaire.tableau);
    displayedColumns: string[] = ['numFacture', 'descFacture', 'refFacture', 'totalFacture', 'action'];
    displayedColumnsV: string[] = ['ubr', 'compte', 'unite', 'code', 't4a', 'reference', 'montant', 'action'];

    selectedCurrency = 'CAD';

    total = 0;
    totalVentilation = 0;


    factureTotal = 0;
    factureTotalCAD = 0;

    constructor(private exchangeRateService: ExchangeRateService)  {super(); }

    onDeleteVentilation(value) {
      const index: number = this.ventilation_budgetaire.tableau.findIndex((el: any) => el.id === value.id);
      if (index >= 0) {
        this.ventilation_budgetaire.tableau.splice(index, 1);
      }

      this.dsVentilation._updateChangeSubscription();
      this.updateVentilationTotal();
    }
    onDelete(value) {
      const index: number = this.description_facture.tableau.findIndex((el: any) => el.id === value.id);
      if (index >= 0) {
        this.description_facture.tableau.splice(index, 1);
      }

      this.dsFactures._updateChangeSubscription();
      this.updateTotal();
    }
    addDescriptionRow() {
      const id = BaseFormComponent.getHighestId(this.description_facture.tableau) + 1;
        this.description_facture.tableau.push({id: id, num: '', description: '', reference: '', total: 0 });
        this.dsFactures._updateChangeSubscription();
        this.updateTotal();
    }

    addVentilationRow() {
      const id = BaseFormComponent.getHighestId(this.ventilation_budgetaire.tableau) + 1;
        this.ventilation_budgetaire.tableau.push({ id: id, ubr: '', compte: '', unite: '', code: '', t4a: '', reference: '', montant: 0});
        this.dsVentilation._updateChangeSubscription();
        this.updateVentilationTotal();
    }

    updateTotal() {
      this.total = 0;
      this.description_facture.tableau.map(bill => this.total += bill.total);
    }

    updateVentilationTotal() {
      this.totalVentilation = 0;
        this.ventilation_budgetaire.tableau.map(v => this.totalVentilation += v.montant);
    }

    getRate(from: string, to: string, start: string, end: string): Promise<number> {
        let sum = 0;
        const seriesNames: string = 'FX' + from + to;

        return this.exchangeRateService.getRates(from, to, start, end)
        .then(rates => {
            rates.observations.map(obs => sum += obs[seriesNames].v);
            return sum / rates.observations.length;
        });
    }

    calculateAmount() {
        // TODO: a confirmer
        // (si on ajoute des champs de date dans le form ou juste prendre current date)
        if (this.selectedCurrency !== 'CAD') {
            this.getRate(this.selectedCurrency, 'CAD', '2019-02-28', '2019-02-28')
            .then(avg => {
                this.factureTotalCAD = Math.round((this.factureTotal * avg) * 100) / 100;
                this.total += this.factureTotalCAD;
            });
        } else {
            this.factureTotalCAD = Math.round(this.factureTotal * 100) / 100;
            this.total += this.factureTotalCAD;
        }
    }

  setSections(): void {
    this.sections = [
      this.beneficiaire, this.entite_employe, this.entite_fournisseur,
      this.fournisseur, this.description_facture, this.ventilation_budgetaire,
      this.demandeur,
    ];
    this.dsFactures = new MatTableDataSource(this.description_facture.tableau);
    this.dsVentilation = new MatTableDataSource(this.ventilation_budgetaire.tableau);
  }

  initCalculs() {
    this.updateTotal();
    this.updateVentilationTotal();
  }


  fg_entite_employe: FormGroup;
  fg_entite_fournisseur: FormGroup;
  fg_beneficiaire: FormGroup;
  fg_demandeur: FormGroup;
  fg_fournisseur: FormGroup;
  fg_description_facture: FormGroup;
  fg_ventilation_budgetaire: FormGroup;

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
    this.fg_demandeur = new FormGroup({
      nom: new FormControl(this.demandeur.nom, Validators.required),
      telephone: new FormControl(this.demandeur.telephone, Validators.required),
    });
    this.fg_fournisseur = new FormGroup({
      adresse: new FormControl(this.fournisseur.adresse),
      telephone: new FormControl(this.fournisseur.telephone),
      fax: new FormControl(this.fournisseur.fax),
      ville: new FormControl(this.fournisseur.ville),
      province: new FormControl(this.fournisseur.province),
      postal: new FormControl(this.fournisseur.postal),
    }, (form) => {
      if (form.value.ville === '' &&
          form.value.postal === '' &&
          form.value.adresse === '' &&
          form.value.province === '' &&
          form.value.telephone === ''
          ||
          form.value.ville !== '' &&
          form.value.postal !== '' &&
          form.value.adresse !== '' &&
          form.value.province !== '' &&
          form.value.telephone !== '') {
            // Soit complètement vide ou complètement plein, OK.
            return null;
          } else {
            return { incomplete: true };
          }
    });
    this.fg_description_facture = new FormGroup({}, (form) => {
      const res: any = {};
      let valid = true;
      let negative = false;
      let error = false;
      this.description_facture.tableau.forEach(line => {
        valid = valid && line.total === 0 || !(line.reference === '' || line.num === '' || line.description === '');
        negative = negative || line.total < 0;
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
    this.fg_ventilation_budgetaire = new FormGroup({}, (form) => {
      const res: any = {};
      let valid = true;
      let negative = false;
      let error = false;
      this.ventilation_budgetaire.tableau.forEach(line => {
        valid = valid && line.montant === 0 || !(line.ubr === '' || line.unite === '' || line.compte === '');
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
    });

    // Fill the control array
    while (this.controls.length !== 0) { this.controls.controls.pop(); }
    this.controls.push(this.fg_entite_employe);
    this.controls.push(this.fg_entite_fournisseur);
    this.controls.push(this.fg_beneficiaire);
    this.controls.push(this.fg_demandeur);
    this.controls.push(this.fg_fournisseur);
    this.controls.push(this.fg_description_facture);
    this.controls.push(this.fg_ventilation_budgetaire);
  }
}



// TODO: Move to service (payment form service)
class Bill {
    id: number;
    num: string;
    description: string;
    reference: string;
    total: number;
}
