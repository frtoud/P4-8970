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
  private dureeDeplacement: number = null;

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

  currency = ["CAN", "US", "EURO", "GBP", "CHF", "BRL"];

}
