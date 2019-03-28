import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'dialog-account-creation-success',
    templateUrl: 'dialog-account-creation-success.html',
  })
  export class SuccessDialog {
  
    constructor(public dialogRef: MatDialogRef<SuccessDialog>) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }