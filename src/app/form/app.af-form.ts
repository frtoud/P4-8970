import { Component } from '@angular/core';
import {MatFormFieldModule, MatGridListModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-af-form',
  templateUrl: './app.af-form.html',
  styleUrls: ['./app.af-form.css']
})
export class AFFormComponent {
  montant :number = 0;
  statutVersement : number = 0;
  onChangeStatus(value)
  {
    this.statutVersement = value;
  }

  ventilation = [
    {ubr:"", compte:"", unite:"", percent:0, montant:0, },
    {ubr:"", compte:"", unite:"", percent:0, montant:0, },
    {ubr:"", compte:"", unite:"", percent:0, montant:0, },
  ];
  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'percent', 'montant'];
  displayedRows: number = 3;
  onChangeRows(value){
    this.displayedRows = Math.max(1, Math.min(value, 30));
    while (this.ventilation.length < this.displayedRows)
    {
      this.ventilation.push({ubr:"", compte:"", unite:"", percent:0, montant:0, },);
    }
    while (this.ventilation.length > this.displayedRows)
    {
      this.ventilation.pop();
    }
  }
}
