import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'payment-form',
  templateUrl: './paymentForm.component.html',
  styleUrls: ['./paymentForm.component.css']
})

export class PaymentFormComponent {
    currency = ["CAN", "US", "EURO", "GBP", "CHF", "BRL"];
    factures: Bill[] = [{ id: "", description: "", reference: "", total: 0, totalCAD: 0 }];
    ventilation = [{ ubr: "", compte: "", unite: "", code: "", t4a: "", reference: "", montant: 0}];

    dsFactures = new MatTableDataSource(this.factures);
    dsVentilation = new MatTableDataSource(this.ventilation);
    displayedColumns: string[] = ['numFacture', 'descFacture', 'refFacture', 'totalFacture', 'totalFactureCAD'];
    displayedColumnsV: string[] = ['ubr', 'compte', 'unite', 'code', 't4a', 'reference', 'montant'];

    total: number = 0;
    totalVentilation: number = 0;

    nomDemandeur: string = "";
    demandeurChecked: boolean = false;
    signatureAdded: boolean = false;

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
}

//TODO: Move to service (payment form service)
class Bill {
    id: string;
    description: string;
    reference: string;
    total: number;
    totalCAD: number;
}