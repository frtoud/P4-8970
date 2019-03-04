import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';

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

  constructor() {
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
}
