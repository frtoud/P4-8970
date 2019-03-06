import {Component, OnInit} from '@angular/core';
import {MatDialogRef, MatDialog, ThemePalette} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import { filter } from 'rxjs/operators';

export interface ParticipantColor {
  name: string;
  color: ThemePalette;
}


@Component({
  selector: 'app-assignation',
  templateUrl: './assignation.component.html',
  styleUrls: ['./assignation.component.css']
})

export class AssignationComponent implements OnInit {

  participants = [{name: 'bram'}, {name: 'johanne'}];

  constructor(public dialog: MatDialog) {
  }
  ngOnInit() {
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ParticipantsDialog, {
      width: '250px',
      hasBackdrop: false
    });
    dialogRef.afterClosed().pipe(filter(name => name))
      .subscribe(name => {
        this.participants.push({name: name});
      });
  }
}

@Component({
  selector: 'participants-dialog',
  templateUrl: 'participants-dialog.html',
})

export class ParticipantsDialog {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ParticipantsDialog>
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ''
    });
  }

  submit(form) {
    this.dialogRef.close(`${form.value.name}`);
  }
}
