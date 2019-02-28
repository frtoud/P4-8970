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

  private duFilled = false;
  private auFilled = false;
  private bothFilled = false;
  private du: any = null;
  private au: any = null;
  private dureeDeplacement: number = 0;

  private fraisInscription: number = 0;
  private transport: number = 0;
  private sejour: number = 0;
  private autres: number = 0;
  private estimationTotal: number = 0;

  currency = ["CAN", "US", "EURO", "GBP", "CHF", "BRL"];
  ventilation = [
    {id:0, ubr:"", compte:"", unite:"", montant:0 },
    {id:1, ubr:"", compte:"", unite:"", montant:0 },
    {id:2, ubr:"", compte:"", unite:"", montant:0 },
  ];
  
  montant :number = 0;
  ventilationTotal :number = 0;
  dSventilation = new MatTableDataSource(this.ventilation);
  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'montant', 'action'];
  rowID: number = 2;

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
    this.duFilled = true;
    this.updateDuree();
  }

  private auChange(str: any): void {
    this.au = str;
    this.auFilled = true;
    this.updateDuree();
  }

  private updateDuree(): void {
    this.bothFilled = this.duFilled && this.auFilled;
    if (this.bothFilled) {
      this.dureeDeplacement = this.au - this.du;
      this.dureeDeplacement = (((this.dureeDeplacement/60)/60)/24)/1000;
    }
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

  private updateEstimationTotal(): void {
    this.estimationTotal = this.fraisInscription + this.transport + this.sejour + this.autres;
  }

  

}
