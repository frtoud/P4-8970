import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {
  MatGridListModule, MatCardModule, MatMenuModule, MatIconModule,
  MatButtonModule, MatToolbarModule, MatListModule, MatFormFieldModule,
  MatNativeDateModule, MatInputModule, MatCheckboxModule, MatTableModule, MatDialogModule,
  MatChipsModule, MatDatepickerModule, MatSelectModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HeaderComponent } from './header/header.component';
import { RouterModule, Routes } from '@angular/router';
import { ArchiveComponent } from './archive/archive.component';
import { DemandeAchatComponent } from './formulaires/demande-achat/demande-achat.component';
import { NouveauFormulaireComponent } from './nouveau-formulaire/nouveau-formulaire.component';
import {AssignationComponent, ParticipantsDialog} from './assignation/assignation.component';
import { PaymentFormComponent } from './templates/paymentForm.component';
import { HttpClientModule } from '@angular/common/http';
import { ExchangeRateService } from './services/exchangeRate.service';


const appRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'archive', component: ArchiveComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    ArchiveComponent,
    DemandeAchatComponent,
    NouveauFormulaireComponent,
    AssignationComponent,
    ParticipantsDialog,
    ArchiveComponent,
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
    LayoutModule,
    MatToolbarModule,
    MatListModule,
    FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    RouterModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatGridListModule,
    MatCheckboxModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatChipsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [
     ParticipantsDialog
  ],
  providers: [ExchangeRateService],
  bootstrap: [AppComponent]
})



export class AppModule { }
