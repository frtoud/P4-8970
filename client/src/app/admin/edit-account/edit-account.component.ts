import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsService, Account } from 'src/app/services/admin/accounts.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {

  public account: Account;
  public title: string;
  public displayPromoteButton = false;
  
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(private route: ActivatedRoute,
              private accountsService: AccountsService,
              private router: Router,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.loadAccount();
  }

  loadAccount() {
    const accountId = this.route.snapshot.paramMap.get('id');
    this.accountsService.getAccountByID(accountId)
    .then(acc => {
      this.account = acc;
      this.displayPromoteButton = this.account.type === "MANAGER";
      this.title = `${this.account.lastName}, ${this.account.firstName} (${this.account.type})`;
      this.emailFormControl.setValue(this.account.email);
    })
    .catch(err => console.log(err.error));
  }

  promoteAccount() {
    const accountId = this.route.snapshot.paramMap.get('id');
    this.account.type = "ADMIN";
    this.accountsService.editAccount(accountId, this.account)
    .then(res => {
      this.loadAccount();
      this.openDialog("check_circle", "Compte mis à jour avec succès!", false);
    })
    .catch(err => this.openDialog("error", err.error, true));
  }

  editAccount(event) {
    event.preventDefault;
    const accountId = this.route.snapshot.paramMap.get('id');
    this.account.email = this.emailFormControl.value;
    this.accountsService.editAccount(accountId, this.account)
    .then(res => {
      this.loadAccount();
      this.openDialog("check_circle", "E-mail mis à jour avec succès!", false);
    })
    .catch(err => this.openDialog("error", err.error, true));
  }

  resetAccountPassword(event) {
    event.preventDefault;
    const accountId = this.route.snapshot.paramMap.get('id');
    this.accountsService.triggerResetPassword(accountId)
    .then(res => {
      this.openDialog("check_circle", "Lien de réinitialisation envoyé!", false);
    })
    .catch(err => this.openDialog("error", err.error, true));
  }

  cancel() {
    this.router.navigateByUrl("/admin");
  }

  openDialog(icon: string, message: string, error: boolean): void {
    this.dialog.open(NotifDialog, {
      width: '300px',
      data: { icon: icon, error: error, message: message }
    });
  }

}

export interface DialogData {
  icon: string,
  error: boolean,
  message: string
}

@Component({
  selector: 'notif-dialog',
  templateUrl: 'notif-dialog.html',
  styleUrls: ['./edit-account.component.css']
})
export class NotifDialog {
  constructor(
    public dialogRef: MatDialogRef<NotifDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
