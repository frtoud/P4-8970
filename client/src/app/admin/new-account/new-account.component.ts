import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Account, AccountsService } from '../../services/admin/accounts.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SuccessDialog } from './dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent {

  lastNameFormControl = new FormControl('', [
    Validators.required,
    this.noWhitespaceValidator
  ]);

  firstNameFormControl = new FormControl('', [
    Validators.required,
    this.noWhitespaceValidator
  ]);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  TYPES = [{ display: "Administrateur", value: "ADMIN" }, 
           { display: "Gestionnaire", value: "MANAGER"}, 
           { display: "Usager", value: "USER" }];

  typeFormControl = new FormControl();
  errorMessage: string;
  displaySpinner: boolean = false;

  constructor(private accountsService: AccountsService,
              public dialog: MatDialog,
              private router: Router) {}

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  enableAddAccount() : boolean {
    if (this.firstNameFormControl.hasError('required') || 
    this.lastNameFormControl.hasError('required') ||
    this.emailFormControl.hasError('required') ||
    this.emailFormControl.hasError('email') ||
    this.firstNameFormControl.hasError('whitespace') ||
    this.lastNameFormControl.hasError('whitespace') ||
    !this.typeFormControl.value) {
      return false;
    }
    return true;
  }

  newAccount(event) {
    event.preventDefault;
    this.errorMessage = undefined;
    let account: Account = {
      firstName : this.firstNameFormControl.value,
      lastName : this.lastNameFormControl.value,
      email : this.emailFormControl.value,
      type: this.typeFormControl.value
    };
    this.displaySpinner = true;
    this.accountsService.addAccount(account)
    .then(() => {
      this.displaySpinner = false;
      this.openDialog();
      this.resetFormControls();
    })
    .catch(err => {
      this.displaySpinner = false;
      this.errorMessage = err.error;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SuccessDialog, {
      width: '250px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  cancel() {
    this.router.navigateByUrl("/admin");
  }

  resetFormControls() {
    this.lastNameFormControl.reset();
    this.emailFormControl.reset();
    this.firstNameFormControl.reset();
    this.typeFormControl.reset();
    this.errorMessage = undefined;
  }

}
