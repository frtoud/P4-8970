import { Component } from '@angular/core';
import {MatFormFieldModule, MatGridListModule, MatTableDataSource} from '@angular/material';
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
    {id:0, ubr:"", compte:"", unite:"", percent:0, montant:0, },
    {id:1, ubr:"", compte:"", unite:"", percent:0, montant:0, },
    {id:2, ubr:"", compte:"", unite:"", percent:0, montant:0, },
  ];
  ventilationTotal :number = 0;
  updateTotal()
  {
    this.ventilationTotal = 0;
    this.ventilation.forEach(element => {
      this.ventilationTotal += element.montant;
    });
  }

  dSventilation = new MatTableDataSource(this.ventilation);
  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'percent', 'montant', 'action'];
  rowID: number = 2;
  onCreate()
  {
    this.ventilation.push(
      {id:this.rowID, ubr:"", compte:"", unite:"", percent:0, montant:0, }
    );
    this.rowID++;
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }
  onDelete(value)
  {
    /*
    for (let i = 0; i < this.ventilation.length; i++) {
      if (this.ventilation[i].id === value.id) {
          this.ventilation.splice(i, 1);
      }
    }*/
    let index : number = this.ventilation.findIndex((el:any) => el.id === value.id);
    if (index >= 0)
    {
      this.ventilation.splice(index, 1);
    }

    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }
}
