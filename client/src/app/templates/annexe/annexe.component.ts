import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { DataSource } from '@angular/cdk/table';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';

class AnnexRowData {
  id:number = 0; 
  date:Date = null; 
  description:string = ""; 
  ref:string = ""; 
  perdiem:number = 0; 
  nbKm:number = 0; 
  pers:string = "false";
  fraisKm:number = 0; 
  chambreST:number = 0;  
  fraisRecMoins:number = 0; 
  fraisRecPlus:number = 0;  
  fourniture:number = 0;  
  inscription:number = 0;  
  qcHqc:string = 'HQC';
  montant:number = 0;  
  devise:string = 'CAN'; 
  deviseCAN:number = 0;  
  fournitureMateriel:boolean = false;
  plusDeCinq:boolean = false;

  //THIS WAS PHYSICALLY PAINFUL TO WRITE
  public add(other: AnnexRowData)
  {
    this.perdiem += other.perdiem;
    this.fraisKm += other.fraisKm;
    this.chambreST += other.chambreST;
    this.fraisRecMoins += other.fraisRecMoins;
    this.fraisRecPlus += other.fraisRecPlus;
    this.fourniture += other.fourniture;
    this.inscription += other.inscription;
  }
  public reset()
  {
    this.perdiem = 0;
    this.fraisKm = 0;
    this.chambreST = 0;
    this.fraisRecMoins = 0;
    this.fraisRecPlus = 0;
    this.fourniture = 0;
    this.inscription = 0;
  }
  public getTotal()
  {
    return this.perdiem
    + this.fraisKm
    + this.chambreST
    + this.fraisRecMoins
    + this.fraisRecPlus
    + this.fourniture
    + this.inscription;
  }
}

@Component({
  selector: 'app-annexe',
  templateUrl: './annexe.component.html',
  styleUrls: ['./annexe.component.css']
})
export class AnnexeComponent implements OnInit {


  constructor() { }

  ngOnInit() {
  }

  ventTotalQC: AnnexRowData = new AnnexRowData();
  ventTotalHQC: AnnexRowData = new AnnexRowData();
  ventTotalHCA = { montant:0, fourniture:0, personne:0};
  
  rowID: number = 1;
  totalDuRapport: number = 777;
  ventilation = [
    new AnnexRowData(),
  ];
  displayedColumns: string[] = ['date', 'description', 'ref', 'perdiem', 'nbKm', 'pers', 'fraisKm','chambreST', 'fraisRecMoins', 'fraisRecPlus', 'fourniture', 'inscription', 'qcHqc', 'montant', 'devise', 'deviseCAN', 'fournitureMateriel', 'plusDeCinq', 'action'];
  
  dSventilation = new MatTableDataSource(this.ventilation);


  updateTotal()
  {
    this.ventTotalQC.reset();
    this.ventTotalHQC.reset();
    this.ventTotalHCA.montant = 0;
    this.ventTotalHCA.fourniture = 0;
    this.ventTotalHCA.personne = 0;

    this.ventilation.forEach(element => {
      //Row math
      element.fraisKm = Math.round((element.pers == "true" ? 0.54 : 0.43) * element.nbKm * 100)/100;
      //Split QC/HQC
      if (element.qcHqc === "QC") this.ventTotalQC.add(element);
      if (element.qcHqc === "HQC") this.ventTotalHQC.add(element);
      //Hors-Canada
      if (element.fournitureMateriel)
      {
        if (!element.plusDeCinq)
        {
          this.ventTotalHCA.fourniture += element.deviseCAN;
        }
          //else... IGNORED...?
      }
      else if (element.plusDeCinq)
      {
        this.ventTotalHCA.personne += element.deviseCAN;
      }
      else
      {
        this.ventTotalHCA.montant += element.deviseCAN;
      }
    });
    this.totalDuRapport = this.ventTotalQC.getTotal() + this.ventTotalHQC.getTotal()
    + this.ventTotalHCA.fourniture + this.ventTotalHCA.montant + this.ventTotalHCA.personne;
  }

  onCreate()
  {
    let row = new AnnexRowData();
    row.id = this.rowID;
    this.ventilation.push(
      row);
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
}
