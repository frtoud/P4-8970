import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA} from '@angular/material';
import {MatDialog} from '@angular/material';

export interface DialogData {
  participants: string[];
}
@Component({
  selector: 'app-assignation',
  templateUrl: './assignation.component.html',
  styleUrls: ['./assignation.component.css']
})

export class AssignationComponent implements OnInit {
  participant = [{name: ''}];
  dSparticipant = new MatTableDataSource(this.participant);
  rowIDParticipants = 2;
  displayedColumnParticipants: string[] = ['participants'];

  constructor(public dialog: MatDialog) {
  }
  ngOnInit() {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {participants: this.participant}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.participant.push(
        {name: result}
      );
      this.rowIDParticipants++;
      this.dSparticipant._updateChangeSubscription();
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'participants-dialog.html',
})

export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
