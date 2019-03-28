import { Component, OnInit, Inject } from '@angular/core';
import { AccountsService } from '../../services/admin/accounts.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface Criteria {
  nameAsc: boolean;
  typeAsc: boolean;
  emailAsc: boolean;
  createdAtAsc: boolean;
  updatedAtAsc: boolean;
}

interface Filter {
  type: string;
  name: string;
}

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  dataSource = [];
  displayedColumns: string[] = ['id', 'name', 'type', 'email', 'createdAt', 'updatedAt'];
  currentCriteria: Criteria = { nameAsc: true, typeAsc: null, emailAsc: null, 
    createdAtAsc: null, updatedAtAsc: null };
  currentFilter: Filter = {type: "ALL", name: null};

  constructor(private accountsService: AccountsService, 
              private router:Router,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountsService.getAccounts()
    .then(accounts => this.dataSource = accounts)
    .catch(err => console.log(err.error));
  }

  navigateToAddAccount() {
    this.router.navigateByUrl('admin/accounts/new');
  }

  getEditAccountRoute(id) {
    return `/admin/accounts/${id}`;
  }

  deleteAccount(id: string) {
    this.accountsService.deleteAccount(id)
    .then(() => this.loadAccounts())
    .catch(() => this.openErrorDialog());
  }

  openConfirmationDialog(id: string, firstName: string, lastName: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '300px',
      data: { _id: id, name: lastName + ', ' + firstName }
    });

    dialogRef.afterClosed().subscribe(id => {
      if (id) {
        this.deleteAccount(id);
      }
    });
  }

  openErrorDialog(): void {
    this.dialog.open(ErrorDialog, {
      width: '300px'
    });
  }

  sortByName(ascending: boolean) {
    if (ascending) {
      this.currentCriteria.nameAsc = true;
      console.log("TRUE");
      this.dataSource.sort((a, b) => 
      (a.lastName + ", " + a.firstName).localeCompare(b.lastName + ", " + b.firstName));
    }
    else {
      this.currentCriteria.nameAsc = false;
      console.log("FALSE");
      this.dataSource.sort((a, b) => 
      (b.lastName + ", " + b.firstName).localeCompare(a.lastName + ", " + a.firstName));
    }
  }

  sortByType() {}

  sortByEmail() {}

  sortByCreatedAt() {}

  sortByUpdatedAt() {}

}

export interface DialogData {
  _id: string;
  name: string;
}

@Component({
  selector: 'delete-confirmation-dialog',
  templateUrl: 'delete-confirmation-dialog.html',
  styleUrls: ['./accounts.component.css']
})
export class ConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'error-dialog',
  templateUrl: 'error-dialog.html',
  styleUrls: ['./accounts.component.css']
})
export class ErrorDialog {
  constructor(public dialogRef: MatDialogRef<ErrorDialog>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}