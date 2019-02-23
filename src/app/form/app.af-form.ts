import { Component } from '@angular/core';
import {MatFormFieldModule, MatGridListModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-af-form',
  templateUrl: './app.af-form.html',
  styleUrls: ['./app.af-form.css']
})
export class AFFormComponent {
  montant :number = 0;
  ventilation = [
  {ubr:"1", compte:"1", unite:"1", percent:1, montant:1, },
  {ubr:"1", compte:"1", unite:"1", percent:1, montant:1, },
  {ubr:"1", compte:"1", unite:"1", percent:1, montant:1, },
  ];
  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'percent', 'montant'];
  displayerRows: number = 4;
  /*emailFormControl = new FormControl('', [
    Validators.required,
  ]);*/
}
