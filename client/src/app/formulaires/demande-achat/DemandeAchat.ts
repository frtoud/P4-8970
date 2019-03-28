import {MatTableDataSource} from '@angular/material';

// TODO: Move to service (payment form service)
class Bill {
  id: string;
  description: string;
  reference: string;
  total: number;
  totalCAD: number;
}

export class DemandeAchat {
  currency = ['CAD', 'USD', 'EUR', 'GBP', 'CHF', 'BRL'];
  factures: Bill[] = [{id: '', description: '', reference: '', total: 0, totalCAD: 0}];
  ventilation = [{ubr: '', compte: '', unite: '', code: '', t4a: '', reference: '', montant: 0}];
  dsFactures = new MatTableDataSource(this.factures);
  dsVentilation = new MatTableDataSource(this.ventilation);
  displayedColumns: string[] = ['numFacture', 'descFacture', 'refFacture', 'totalFacture', 'totalFactureCAD'];
  displayedColumnsV: string[] = ['ubr', 'compte', 'unite', 'code', 't4a', 'reference', 'montant'];
  selectedCurrency = 'CAD';
  total = 0;
  totalVentilation = 0;
  nomDemandeur = '';
  demandeurChecked = false;
  signatureAdded = false;
  factureTotal = 0;
  factureTotalCAD = 0;

  constructor() {
  }

  addDescriptionRow() {
    this.factures.push({id: '', description: '', reference: '', total: 0, totalCAD: 0});
    this.dsFactures._updateChangeSubscription();
    this.updateTotal();
  }

  addVentilationRow() {
    this.ventilation.push({ubr: '', compte: '', unite: '', code: '', t4a: '', reference: '', montant: 0});
    this.dsVentilation._updateChangeSubscription();
    this.updateVentilationTotal();
  }

  updateTotal() {
    this.factures.map(bill => this.total += bill.totalCAD);
  }

  updateVentilationTotal() {
    this.ventilation.map(v => this.total += v.montant);
  }

  addSignature() {
    this.signatureAdded = !this.signatureAdded;
  }

  removeSignature() {
    this.signatureAdded = !this.signatureAdded;
    // TODO: a changer (selon la personne assignee pour chaque bloc de signature)
    this.demandeurChecked = false;
    this.nomDemandeur = '';
  }

  // getRate(from: string, to: string, start: string, end: string): void {
  // }

  calculateAmount() {
  }
}
