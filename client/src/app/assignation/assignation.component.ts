import {Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver, Inject } from '@angular/core';
import {MatDialog} from '@angular/material';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { ParticipantsDialog } from './participants-dialog';

import { FormDirective } from '../nouveau-formulaire/form-host.directive';

import { TemplateService, FormData } from '../services/template.service';
import { InstanceService, Instance } from '../services/instance.service';
import { UserService, User } from '../services/users.service';
import { BaseFormComponent } from '../templates/base-form.component';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';
import { Subscription } from 'rxjs';
import { FeedbackDialogComponent } from '../feedback-dialog/feedback-dialog.component';

export interface Participant {
  name: string;
  id: string;
}

export interface File {
  name: string;
}

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-assignation',
  templateUrl: './assignation.component.html',
  styleUrls: ['./assignation.component.css']
})

export class AssignationComponent implements OnInit, OnDestroy {


  listCollaborateurs: User[];
  collaboratorID = '';
  currentForm: FormData;

  participants: User[] = []; // Liste à afficher
  usedParticipants: User[] = []; // Sous-liste de ceux qui ont été assignés
  participantInsuffisants = true; // TRUE si usedParticipants est vide

  sub: Subscription;
  referenceId: string = null;

  @ViewChild(FormDirective) formHost: FormDirective;
  @ViewChild(FileUploaderComponent) fileUploader: FileUploaderComponent;
  formInstance: BaseFormComponent;

  constructor(public dialog: MatDialog,
    private componentFactoryResolver: ComponentFactoryResolver,
    private templateService: TemplateService,
    private userService: UserService,
    private instanceService: InstanceService,
    private router: Router, private route: ActivatedRoute) { }


  tiles: Tile[] = [
    {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 1, color: 'lightgreen'},
    {text: 'Three', cols: 2, rows: 2, color: 'lightpink'},
  ];
  files: File[] = [
    {name: 'file.txt'}
  ];

  displayProgressSpinner = false;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const element = this.templateService.getForm(id);
    if (element) {
      this.currentForm = element;
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(element.component);
      const viewContainerRef = this.formHost.viewContainerRef;
      viewContainerRef.clear();
      this.formInstance = viewContainerRef.createComponent(componentFactory).instance as BaseFormComponent;

      this.sub = this.route.queryParams.subscribe(params => {
        this.referenceId = params['ref'] || null; });
        // NULL = formulaire frais; rien besoin de plus.
        this.userService.getAllUsers().then(list => {
          this.listCollaborateurs = list;
          if (this.referenceId !== null) { this.initCopy(); }
        });

    } else {
      // WRONG ID!!
      this.router.navigate(['/new']);
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initCopy() {
    // Suite du OnInit, pour la copie d'un formulaire existant
    this.instanceService.getInstance(this.referenceId).then(form => {
      this.fileUploader.attachedFiles = form.attachements;
      this.formInstance.setInterface(form.data);
      this.formInstance.clearSignatures();
      // get form.nomFormulaire
      form.collaborateurs.forEach(c => {
        const foundUser = this.listCollaborateurs.find(u => u._id === c.idCollaborateur);
        if (foundUser) { this.participants.push(foundUser); }
      });
      this.formInstance.addListeners();
    });
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  openDialog(): void {
    const randomColor = this.getRandomColor();
    const dialogRef = this.dialog.open(ParticipantsDialog, {
      width: '500px',
      data: {options: this.listCollaborateurs, participants: this.participants},
    });
    dialogRef.afterClosed().pipe(filter(user => user))
      .subscribe(user => {
        this.participants.push(user as User);
      });
  }

  openFeedbackDialog(icon: string, message: string, error: boolean): void {
    this.dialog.open(FeedbackDialogComponent, {
      width: '300px',
      data: { icon: icon, error: error, message: message }
    });
    this.router.navigate(['/dashboard']);
  }

  loseFocus() {
    this.collaboratorID = null;
    this.formInstance.stopAssignation();
    this.testParticipants();
  }
  getFocus(participant) {
    if (this.collaboratorID === participant._id) {
      this.loseFocus();
    } else {
      this.collaboratorID = participant._id;
      this.formInstance.startAssignation(this.collaboratorID);
    }
    this.testParticipants();
  }
  dropParticipant(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.participants, event.previousIndex, event.currentIndex);
  }

  onSend() {
    this.displayProgressSpinner = true;
    this.testParticipants();

    if (!this.participantInsuffisants) {
      this.instanceService.postInstance(this.formInstance.getInterface(),
      this.fileUploader.attachedFiles, this.usedParticipants, this.currentForm.id, this.currentForm.name).then(res => {
        this.displayProgressSpinner = false;
        this.openFeedbackDialog("check_circle", "Formulaire créé avec succès!", false);
      }).catch(err => {
        this.displayProgressSpinner = false;
        this.openFeedbackDialog("error", "Une erreur est survenue lors de la création!", true);
      });
    }
  }
  onReturn() {
    this.router.navigate(['/newForm']);
  }

  testParticipants() {
    // vérifier si la liste de participants actuelle existe
    // IE. on peut mettre des participants tant qu'on veux on peut pas send tant qu'il y a pas au moins un assigned
    // La vraie liste est envoyée
    const ids: Set<string> = this.formInstance.getAssignations();
    this.usedParticipants = this.participants.filter(user => ids.has(user._id));
    this.participantInsuffisants = this.usedParticipants.length === 0;
  }
  deleteParticipant(participant) {
    this.formInstance.removeAssignation(participant._id);
    this.participants = this.participants.filter((v) => v._id !== participant._id);
    this.loseFocus();
  }
  
}

