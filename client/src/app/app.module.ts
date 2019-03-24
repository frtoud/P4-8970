import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';

import { AFFormComponent } from './templates/aide-financiere-form/app.af-form';
import {
  MatGridListModule, MatCardModule, MatMenuModule, MatIconModule,
  MatButtonModule, MatToolbarModule, MatListModule,
  MatNativeDateModule, MatInputModule, MatFormFieldControl, MatDialogModule,
  MatChipsModule, MatSelectModule
} from '@angular/material';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HeaderComponent } from './header/header.component';
import { ArchiveComponent } from './archive/archive.component';
import { VoyageFormComponent } from './templates/voyage-form/voyage-form.component';
import { DemandeAchatComponent } from './templates/demande-achat/demande-achat.component';
import { NouveauFormulaireComponent } from './nouveau-formulaire/nouveau-formulaire.component';
import {AssignationComponent, ParticipantsDialog} from './assignation/assignation.component';
import { PaymentFormComponent } from './templates/payment-form/paymentForm.component';
import { ExchangeRateService } from './services/exchangeRate.service';


const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'archive', component: ArchiveComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    AFFormComponent,
    HeaderComponent,
    DashboardComponent,
    ArchiveComponent,
    VoyageFormComponent,
    LoginComponent,
    DemandeAchatComponent,
    NouveauFormulaireComponent,
    AssignationComponent,
    ParticipantsDialog,
    PaymentFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTableModule,
    LayoutModule,
    MatToolbarModule,
    MatListModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    RouterModule,
    MatDialogModule,
    MatChipsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [
     ParticipantsDialog
  ],
  providers: [
    ExchangeRateService,
    LoginService
    ],
  bootstrap: [AppComponent]
})



export class AppModule { }

