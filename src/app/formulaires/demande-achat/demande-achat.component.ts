import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-demande-achat',
  templateUrl: './demande-achat.component.html',
  styleUrls: ['./demande-achat.component.css']
})

export class DemandeAchatComponent implements OnInit {
  options: FormGroup;
  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }
  ngOnInit() {
  }
}
