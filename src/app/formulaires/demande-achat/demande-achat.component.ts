import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-demande-achat',
  templateUrl: './demande-achat.component.html',
  styleUrls: ['./demande-achat.component.css']
})

export class DemandeAchatComponent implements OnInit {
  options: FormGroup;
  montant :number = 0;
  statutVersement : number = 0;
  ventilation =
    [
    {id:0, ubr:"", compte:"", unite:"", percent:0, montant:0, },
    {id:1, ubr:"", compte:"", unite:"", percent:0, montant:0, },
    {id:2, ubr:"", compte:"", unite:"", percent:0, montant:0, },
    ];
  ventilationTotal :number = 0;
  dSventilation = new MatTableDataSource(this.ventilation);
  displayedColumns: string[] = ['ubr', 'compte', 'unite', 'percent', 'montant', 'action'];
  rowID: number = 2;

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
  }

  onChangeStatus(value){
    this.statutVersement = value;
  }


  onCreate() {
    this.ventilation.push(
      {id:this.rowID, ubr:"", compte:"", unite:"", percent:0, montant:0, }
    );
    this.rowID++;
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }

  onDelete(value) {
    for (let i = 0; i < this.ventilation.length; i++) {
      if (this.ventilation[i].id === value) {
        this.ventilation.splice(i, 1);
      }
    }
    this.dSventilation._updateChangeSubscription();
    this.updateTotal();
  }

  updateTotal() {
    this.ventilationTotal = 0;
    this.ventilation.forEach(element => {
      this.ventilationTotal += element.montant;
    });
  }

}

