import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { LoginService } from './services/login.service';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule, Routes, Router } from '@angular/router';
import { AFFormComponent } from './templates/aide-financiere-form/app.af-form';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { AnnexeComponent } from './templates/annexe/annexe.component';
import { FormDeplacementComponent } from './templates/form-deplacement/form-deplacement.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { HeaderComponent } from './header/header.component';
import { ArchiveComponent } from './archive/archive.component';
import { VoyageFormComponent } from './templates/voyage-form/voyage-form.component';
import { DemandeAchatComponent } from './templates/demande-achat/demande-achat.component';
import { NouveauFormulaireComponent } from './nouveau-formulaire/nouveau-formulaire.component';
import { AssignationComponent } from './assignation/assignation.component';
import { EditionComponent } from './edition/edition.component';
import { ParticipantsDialog } from './assignation/participants-dialog';
import { PaymentFormComponent } from './templates/payment-form/paymentForm.component';
import { ExchangeRateService } from './services/exchangeRate.service';
import { AccountsComponent, ConfirmationDialog, ErrorDialog } from './admin/accounts/accounts.component';
import { NewAccountComponent } from './admin/new-account/new-account.component';
import { EditAccountComponent, NotifDialog } from './admin/edit-account/edit-account.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { SettingsComponent } from './admin/settings/settings.component';
import { AccountsService } from './services/admin/accounts.service';
import { SuccessDialog } from './admin/new-account/dialog.component';
import { SetPasswordComponent } from './set-password/set-password.component';
import { AccountTypePipe, StatePipe } from './pipes/account-type.pipe';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';
import { DashboardService } from './services/dashboard.service';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { FormDirective } from './nouveau-formulaire/form-host.directive';
import { TemplateService } from './services/template.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { UploadService } from './services/upload.service';
import { SignatureBlockComponent } from './templates/fields';
import { FeedbackDialogComponent } from './feedback-dialog/feedback-dialog.component';

const appRoutes: Routes = [
  { path: 'new', component: NouveauFormulaireComponent, canActivate: [AuthGuard] },
  { path: 'new/:id', component: AssignationComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id/:state', component: EditionComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: ProfileComponent, canActivate: [RoleGuard]},
  { path: 'admin/accounts', component: AccountsComponent, canActivate: [RoleGuard] },
  { path: 'admin/accounts/new', component: NewAccountComponent, canActivate: [RoleGuard] },
  { path: 'admin/accounts/:id', component: EditAccountComponent, canActivate: [RoleGuard] },
  { path: 'password/:id', component: SetPasswordComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'archive', component: ArchiveComponent, canActivate: [AuthGuard] },
  { path: 'userSettings', component: UserSettingsComponent, canActivate: [AuthGuard] },
  { path: 'newForm', component: NouveauFormulaireComponent, canActivate: [AuthGuard] },
  { path: '', component: LoginComponent }
]

@NgModule({
  declarations: [
    FormDirective,
    AppComponent,
    HeaderComponent,
    ArchiveComponent,
    LoginComponent,
    NouveauFormulaireComponent,
    AssignationComponent,
    ParticipantsDialog,
    AFFormComponent,
    VoyageFormComponent,
    DemandeAchatComponent,
    PaymentFormComponent,
    FormDeplacementComponent,
    AnnexeComponent,
    AccountsComponent,
    NewAccountComponent,
    EditAccountComponent,
    ProfileComponent,
    SettingsComponent,
    SuccessDialog,
    ConfirmationDialog,
    ErrorDialog,
    NotifDialog,
    SetPasswordComponent,
    AccountTypePipe,
    DashboardComponent,
    UserSettingsComponent,
    StatePipe,
    EditionComponent,
    FileUploaderComponent,
    SignatureBlockComponent,
    FeedbackDialogComponent,
  ],
  imports: [
    LayoutModule, MaterialModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ScrollDispatchModule,
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [
    ParticipantsDialog,
    SuccessDialog,
    NewAccountComponent,
    ConfirmationDialog,
    ErrorDialog,
    NotifDialog,
    AccountsComponent,
    AFFormComponent,
    VoyageFormComponent,
    DemandeAchatComponent,
    PaymentFormComponent,
    FormDeplacementComponent,
    AnnexeComponent,
    FeedbackDialogComponent,
  ],
  providers: [
    DashboardService,
    ExchangeRateService,
    TemplateService,
    LoginService,
    AccountsService,
    UploadService
    ],
  bootstrap: [AppComponent]
})

export class AppModule { }

