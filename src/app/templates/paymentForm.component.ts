import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule, 
         MatInputModule,
         MatDatepickerModule,
         MatNativeDateModule,
         MatButtonModule,
         MatCheckboxModule,
         MatSelectModule } from '@angular/material';

@Component({
  selector: 'payment-form',
  templateUrl: './paymentForm.component.html',
  styleUrls: ['./paymentForm.component.css']
})

export class PaymentFormComponent {
    currency = ["CAN", "US", "EURO", "GBP", "CHF", "BRL"];
}