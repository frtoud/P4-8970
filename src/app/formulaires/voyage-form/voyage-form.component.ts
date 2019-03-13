import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'voyage-form',
  templateUrl: './voyage-form.component.html',
  styleUrls: ['./voyage-form.component.css']
})

export class VoyageFormComponent implements OnInit {

  private du: any = null;
  private au: any = null;
  private dureeDeplacement: number = 0;

  private avance1: number = 0;
  private avance2: number = 0;
  private avanceTotal: number = 0;

  private fraisInscription: number = 0;
  private transport: number = 0;
  private sejour: number = 0;
  private autres: number = 0;
  private estimationTotal: number = 0;

  montant :number = 0;
  ventilationTotal :number = 0;
  rowID: number = 2;

  nomDemandeur: string = "";
  demandeurChecked: boolean = false;
  signatureAdded: boolean = false;

  currency = ["CAN", "US", "EURO", "GBP", "CHF", "BRL"];
  ventilation = [
    {id:0, ubr:"", compte:"", unite:"", montant:0 },
    {id:1, ubr:"", compte:"", unite:"", montant:0 },
    {id:2, ubr:"", compte:"", unite:"", montant:0 },
  ];
  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'montant', 'action'];

  dSventilation = new MatTableDataSource(this.ventilation);

  updateAvanceTotal() {
    this.avanceTotal = this.avance1 + this.avance2;
  }

  updateTotal()
  {
    this.ventilationTotal = 0;
    this.ventilation.forEach(element => {
      this.ventilationTotal += element.montant;
    });
  }

  onCreate()
  {
    this.ventilation.push(
      {id:this.rowID, ubr:"", compte:"", unite:"", montant:0 }
    );
    this.rowID++;
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }

  onDelete(value)
  {
    for (let i = 0; i < this.ventilation.length; i++) {
      if (this.ventilation[i].id === value) {
          this.ventilation.splice(i, 1);
      }
    }
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }


  constructor() { }

  ngOnInit() {
  }

  private duChange(str: any): void {
    this.du = str;
    this.updateDuree();
  }

  private auChange(str: any): void {
    this.au = str;
    this.updateDuree();
  }

  private updateDuree(): void {
    this.dureeDeplacement = this.au - this.du;
    this.dureeDeplacement = (((this.dureeDeplacement/60)/60)/24)/1000;
  }

  private updateFraisInscription(frais: number): void {
    this.fraisInscription = frais;
    this.updateEstimationTotal();
  }

  private updateTransport(frais: number): void {
    this.transport = frais;
    this.updateEstimationTotal();
  }

  private updateSejour(frais: number): void {
    this.sejour = frais;
    this.updateEstimationTotal();
  }

  private updateAutres(frais: number): void {
    this.autres = frais;
    this.updateEstimationTotal();
  }

  addSignature() {
    this.signatureAdded = !this.signatureAdded;
  }

  removeSignature() {
      this.signatureAdded = !this.signatureAdded;
      //TODO: a changer (selon la personne assignee pour chaque bloc de signature)
      this.demandeurChecked = false;
      this.nomDemandeur = "";
  }

  private updateEstimationTotal(): void {
    this.estimationTotal = this.fraisInscription + this.transport + this.sejour + this.autres;
  }
}
