import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA} from '@angular/material';
import {MatDialog} from '@angular/material';

export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'app-assignation',
  templateUrl: './assignation.component.html',
  styleUrls: ['./assignation.component.css']
})
export class AssignationComponent implements OnInit {
  participant = [{id: 0}];
  dSparticipant = new MatTableDataSource(this.participant);
  displayedColumnsVentilation: string[] = ['participants'];
  rowIDParticipants = 2;
  animal: string;
  name: string;
  constructor(public dialog: MatDialog) {
  }
  ngOnInit() {
  }
  onCreate() {
    this.participant.push(
      {id: this.rowIDParticipants}
    );
    this.rowIDParticipants++;
    this.dSparticipant._updateChangeSubscription();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})

export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
