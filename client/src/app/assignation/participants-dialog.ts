import {Component, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormControl} from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

import { User } from '../services/users.service';
import { Observable } from 'rxjs';


// Class for the dialog
@Component({
    selector: 'participants-dialog',
    templateUrl: 'participants-dialog.html',
  })
  export class ParticipantsDialog {
    form: FormControl = new FormControl();
  
    filteredOptions: Observable<User[]>;
  
    constructor(
      private formBuilder: FormBuilder,
      private dialogRef: MatDialogRef<ParticipantsDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any) {}
  
    ngOnInit() {
      
      this.filteredOptions = this.form.valueChanges
        .pipe(
          startWith<string | User>(''),
          map(value => typeof value === 'string' ? value : ""),
          map(user => user ? this.filtrer(user) : this.data.options.slice())
        );
    }
  
    displayFn(user?: User): string | undefined {
      return user ? user.firstName + ' ' + user.lastName + ': ' + user.email : undefined;
    }
  
    private filtrer(name: string): User[] {
      const filterValue = name.toLowerCase();
  
      return this.data.options.filter(option => ( //TODOkete: filtrer sur tout le string
           option.firstName.toLowerCase().indexOf(filterValue) === 0
        || option.lastName.toLowerCase().indexOf(filterValue) === 0
        || option.email.toLowerCase().indexOf(filterValue) === 0
      )
      );
    }
  
    submit(form, event) {
      //event.preventDefault;
      if (form.value 
    && !this.data.participants.find(value => value._id === form.value._id))
      {
        this.data.participants.push(form.value);
        form.reset();
      }
    }
  }
  