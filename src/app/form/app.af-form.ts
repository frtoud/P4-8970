import { Component } from '@angular/core';
import {MatFormFieldModule, MatGridListModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-af-form',
  templateUrl: './app.af-form.html',
  styleUrls: ['./app.af-form.css']
})
export class AFFormComponent {
  title = 'Aide Financière';
}
