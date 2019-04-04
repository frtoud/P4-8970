import {Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormControl, ValidationErrors} from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

import { User } from '../services/users.service';
import { Observable } from 'rxjs';


// Class for the dialog
@Component({
// tslint:disable-next-line: component-selector
    selector: 'participants-dialog',
    templateUrl: 'participants-dialog.html',
    styleUrls: ['./assignation.component.css']
  })
// tslint:disable-next-line: component-class-suffix
  export class ParticipantsDialog implements OnInit {
    form: FormControl = new FormControl('', (control): ValidationErrors | null => {
      let hasError = false;
      const errors: any = {};

      if (control.value) {
        if (!control.value._id) {
          errors.invalid = true;
          hasError = true;
        } else if (this.data.participants.find(value => value._id === control.value._id)) {
          errors.exists = true;
          hasError = true;
        }
      }

      return hasError ? errors : null;
    });

    filteredOptions: Observable<User[]>;

    constructor(
      private formBuilder: FormBuilder,
      private dialogRef: MatDialogRef<ParticipantsDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}

    ngOnInit() {
      this.filteredOptions = this.form.valueChanges
        .pipe(
          startWith<string | User>(''),
          map(value => typeof value === 'string' ? value : ''),
          map(user => user ? this.filtrer(user) : this.data.options.slice())
        );
    }

    displayFn(user?: User): string | undefined {
      return user ? user.firstName + ' ' + user.lastName + ': ' + user.email : undefined;
    }

    private filtrer(name: string): User[] {
      const filterValue = name.toLowerCase();

      return this.data.options.filter(option => ( // Redundency to prevent crashes
           option.firstName ? option.firstName.toLowerCase().indexOf(filterValue) === 0 : false
        || option.lastName ? option.lastName.toLowerCase().indexOf(filterValue) === 0 : false
        || option.email ? option.email.toLowerCase().indexOf(filterValue) === 0 : false
      ));
    }

    submit(form) {
      if (form.value && form.value._id
    && !this.data.participants.find(value => value._id === form.value._id)) {
        this.data.participants.push(form.value);
        form.reset();
      }
    }
  }
