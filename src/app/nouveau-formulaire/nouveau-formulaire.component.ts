import { Component, OnInit } from '@angular/core';

export interface FormData {
  name: string;
}

const FORMS_DATA: FormData[] = [
  {name: 'Demande d’achat'},
  {name: 'Demande de paiement'},
  {name: 'Aide financière'},
  {name: 'Rapport de déplacement'},
  {name: 'Avance de voyage'}
];

@Component({
  selector: 'app-nouveau-formulaire',
  templateUrl: './nouveau-formulaire.component.html',
  styleUrls: ['./nouveau-formulaire.component.css']
})
export class NouveauFormulaireComponent implements OnInit {
  dataSource = FORMS_DATA;
  constructor() { }

  ngOnInit() {
  }

}
