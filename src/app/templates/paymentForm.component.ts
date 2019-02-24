import { Component } from '@angular/core';

@Component({
  selector: 'payment-form',
  templateUrl: './paymentForm.component.html',
  styleUrls: ['./paymentForm.component.css']
})

export class PaymentFormComponent {
    currency = ["CAN", "US", "EURO", "GBP", "CHF", "BRL"];
}