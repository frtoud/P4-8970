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
  montant = 0;
  statutVersement = 0;
  ventilation = [{id: 0, ubr: '', compte: '', unite: '', percent: 0, montant: 0}];
  items = [{id: 0, ref: 0, descr: '', quant: 0, prixUnit: 0, totalItems: 0}];
  ventilationTotal = 0;
  dSventilation = new MatTableDataSource(this.ventilation);
  dSitems = new MatTableDataSource(this.items);
  displayedColumnsVentilation: string[] = ['ubr', 'compte', 'unite', 'percent', 'montant', 'action'];
  displayedColumnsItems: string[] = ['ref', 'descr', 'quant', 'prixUnit', 'totalItems', 'action'];
  rowIDVentilation = 2;
  rowIDItems = 2;
  itemsTotal = 0;

  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {}

  onChangeStatus(value) {
    this.statutVersement = value;
  }

  onCreate() {
    this.ventilation.push(
      {id: this.rowIDVentilation, ubr: '', compte: '', unite: '', percent: 0, montant: 0, }
    );
    this.items.push(
      {id: this.rowIDItems, ref: 0, descr: '', quant: 0, prixUnit: 0, totalItems: 0 }
    );
    this.rowIDVentilation++;
    this.rowIDItems++;
    this.dSventilation._updateChangeSubscription();
    this.dSitems._updateChangeSubscription();
    this.updateTotal();
  }

  onDelete(value) {
    for (let i = 0; i < this.ventilation.length; i++) {
      if (this.ventilation[i].id === value) {
        this.ventilation.splice(i, 1);
      }
    }
    this.dSventilation._updateChangeSubscription();
    this.dSitems._updateChangeSubscription();
    this.updateTotal();
  }

  updateTotal() {
    this.ventilationTotal = 0;
    this.ventilation.forEach(element => {
      this.ventilationTotal += element.montant;
    });
    this.items.forEach(element => {
      this.itemsTotal += element.prixUnit;
    });
  }

}

