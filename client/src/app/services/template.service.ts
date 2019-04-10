import { Injectable } from '@angular/core';
import { DemandeAchatComponent } from '../templates/demande-achat/demande-achat.component';
import { PaymentFormComponent } from '../templates/payment-form/paymentForm.component';
import { AFFormComponent } from '../templates/aide-financiere-form/app.af-form';
import { FormDeplacementComponent } from '../templates/form-deplacement/form-deplacement.component';
import { VoyageFormComponent } from '../templates/voyage-form/voyage-form.component';
 
 export interface FormData {
    name: string;
    id: string;
    component: any;
  }

  @Injectable({
    providedIn: 'root',
  })
  export class TemplateService
  {
    FORMS_DATA: FormData[] = [
    {name: 'Demande d’achat', id:"DA", component: DemandeAchatComponent},
    {name: 'Demande de paiement', id:"DP", component: PaymentFormComponent},
    {name: 'Aide financière', id:"AF", component: AFFormComponent},
    {name: 'Rapport de déplacement', id:"RD", component: FormDeplacementComponent},
    {name: 'Avance de voyage', id:"A", component: VoyageFormComponent}
    ];

    getForm(id)
    {
        return this.FORMS_DATA.find((val) => id === val.id);
    }
    getForms()
    {
        return this.FORMS_DATA;
    }
}