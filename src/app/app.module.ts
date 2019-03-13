import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from './services/login.service';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import {MatGridListModule, MatCardModule, MatMenuModule, 
        MatIconModule, MatButtonModule, MatToolbarModule, 
        MatListModule, MatFormFieldControl, MatNativeDateModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';

import { AFFormComponent } from './form/app.af-form';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { HeaderComponent } from './header/header.component';
import { ArchiveComponent } from './archive/archive.component';

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
    LoginComponent
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatTableModule,
    LayoutModule,
    MatToolbarModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    LoginService
  ],
  bootstrap: [AppComponent]
})



export class AppModule { }
