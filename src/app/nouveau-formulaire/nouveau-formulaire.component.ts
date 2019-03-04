import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nouveau-formulaire',
  templateUrl: './nouveau-formulaire.component.html',
  styleUrls: ['./nouveau-formulaire.component.css']
})
export class NouveauFormulaireComponent implements OnInit {
  typesOfForms: string[] = ['Demande d’achat', 'Demande de paiement', 'Aide financière', 'Rapport de déplacement', 'Avance de voyage '];

  constructor() { }

  ngOnInit() {
  }

}
