import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'voyage-form',
  templateUrl: './voyage-form.component.html',
  styleUrls: ['./voyage-form.component.css']
})

export class VoyageFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  currency = ["CAN", "US", "EURO", "GBP", "CHF", "BRL"];

}
