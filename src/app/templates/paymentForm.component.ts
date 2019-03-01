import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { ExchangeRateService } from '../services/exchangeRate.service';

@Component({
  selector: 'payment-form',
  templateUrl: './paymentForm.component.html',
  styleUrls: ['./paymentForm.component.css']
})

export class PaymentFormComponent {
    currency = [{display: "CAN", value: "CAD"}, 
    {display: "US", value: "USD"}, 
    {display: "EURO", value: ""}, 
    {display: "GBP", value: ""}, 
    {display: "CHF", value: ""}, 
    {display: "BRL", value: ""}];
    factures: Bill[] = [{ id: "", description: "", reference: "", total: 0, totalCAD: 0 }];
    ventilation = [{ ubr: "", compte: "", unite: "", code: "", t4a: "", reference: "", montant: 0}];

    dsFactures = new MatTableDataSource(this.factures);
    dsVentilation = new MatTableDataSource(this.ventilation);
    displayedColumns: string[] = ['numFacture', 'descFacture', 'refFacture', 'totalFacture', 'totalFactureCAD'];
    displayedColumnsV: string[] = ['ubr', 'compte', 'unite', 'code', 't4a', 'reference', 'montant'];

    selectedCurrency: string = "CAD";
    
    total: number = 0;
    totalVentilation: number = 0;

    nomDemandeur: string = "";
    demandeurChecked: boolean = false;
    signatureAdded: boolean = false;

    factureTotal: number = 0;

    constructor(private exchangeRateService: ExchangeRateService) {}

    addDescriptionRow() {
        this.factures.push({ id: "", description: "", reference: "", total: 0, totalCAD: 0 });
        this.dsFactures._updateChangeSubscription();
        this.updateTotal();
    }

    addVentilationRow() {
        this.ventilation.push({ ubr: "", compte: "", unite: "", code: "", t4a: "", reference: "", montant: 0});
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
        //TODO: 
        this.demandeurChecked = false;
        this.nomDemandeur = "";
    }

    getRate(from: string, to: string, start: string, end: string): number {
        let sum: number = 0;
        let avg: number = 0;
        let seriesNames: string = "FX" + from + to;
        this.exchangeRateService.getRates(from, to, start, end)
        .then(rates => {
            rates.observations.map(obs => sum += obs[seriesNames].v);
            console.log(sum/rates.observations.length);
            avg = sum/rates.observations.length;
        });
        return avg;
    }

    calculateAmount() {
        return this.factureTotal * this.getRate(this.selectedCurrency, "CAD", "2019-02-28", "2019-02-28");
    }
}

//TODO: Move to service (payment form service)
class Bill {
    id: string;
    description: string;
    reference: string;
    total: number;
    totalCAD: number;
}