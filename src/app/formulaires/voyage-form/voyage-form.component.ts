import { Component, OnInit } from '@angular/core';

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

  currency = ["CAN", "US", "EURO", "GBP", "CHF", "BRL"];

}
