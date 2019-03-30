import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { FormControl, NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, TooltipPosition } from '@angular/material';
import { Time } from '@angular/common';
import { DashboardService, Form, Collaborateur } from '../services/dashboard.service';
import { LoginService, AuthenticatedUser } from '../services/login.service';
import { StatePipe } from '../pipes/account-type.pipe';

// Status
// this.userAccess = ["WAITING", "EDITION", "COMPLETED", "PREVIEW"];
// this.formStatus = ["IN_PROGRESS", "COMPLETED", "ARCHIVED", "CANCELED"];
// this.types = ['ADMIN', 'MANAGER', 'USER'];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  cardCollaborateurs: string[] = ["collaborateursList"];
  vueListeColumns: string[] = ['idForm', 'auteur', 'collaborateurs', 'statut', 'modifieLe', 'creeLe', 'modifier'];
  
  searchName: string = "";
  searchStatus: string ="";
  searchPatron: string ="";
  dateFrom: Date;
  dateTo: Date;
  searchActivated: boolean = false;
  
  searchResult: Form[] = [];
  dashboardForms: Form[] = [];
  displayedCards: Form[] = [];
  aCompleterCards: Form[] = [];
  autresCards: Form[] = [];

  position = new FormControl('above');
  vueCarte: string = "true";
  currentUser: AuthenticatedUser;

  constructor(public dialog: MatDialog, private breakpointObserver: BreakpointObserver,
    private dashboardService: DashboardService, private loginService: LoginService) {}

  ngOnInit() {
    this.loginService.getUser().then(login=> {
      
      this.currentUser = login;

    
      switch(this.currentUser.type) {
        case 'ADMIN':
          this.dashboardService.getAllForms().then(forms => {
            this.sortCardsDecreasingDate(forms);
            this.dashboardForms = forms;
            this.displayedCards = forms;
            this.sortACompleterAutres();
          }).catch(err => console.log(err.error));
          break;
        case 'MANAGER':
          this.dashboardService.getForms(this.currentUser._id).then(forms => {
            this.sortCardsDecreasingDate(forms);
            this.dashboardForms = forms;
            this.displayedCards = forms;
            this.sortACompleterAutres();
          }).catch(err => console.log(err.error));
          break;
        case 'USER':
          this.dashboardService.getForms(this.currentUser._id).then(forms => {
            this.sortCardsDecreasingDate(forms);
            let collaborationForms: Form[] = this.searchUserAccesCollaborations(forms);
            this.dashboardForms = collaborationForms;
            this.displayedCards = collaborationForms;
            this.sortACompleterAutres();
          }).catch(err => console.log(err.error));
          break;
      }
    });
  }

  //https://stackoverflow.com/questions/10123953/sort-javascript-object-array-by-date
  private sortCardsDecreasingDate(forms: Form[]) {
    forms.sort(function(a,b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      let dateA = new Date(a.creeLe);
      let dateB = new Date(b.creeLe);
      return +dateB - +dateA;
    });
  }

  private searchUserAccesCollaborations(forms: Form[]): Form[]
  {
    let results: Form[] = [];

    forms.forEach(form => {
      form.collaborateurs.forEach(collaborateur =>{
        if (collaborateur.idCollaborateur == this.currentUser._id) {
          if (collaborateur.acces == 'EDITION' ||
              collaborateur.acces == 'COMPLETED' ||
              collaborateur.acces == 'PREVIEW') {
                results.push(form);
          }
        }
      })
    });

    return results;
  }

  // return values : res = ["VALIDATE", "EDIT", "VIEW"];
  determineState(form: Form): string {
    let res = 'VIEW';
    let userIsAuthor = form.auteur.idAuteur === this.currentUser._id;
    
    if (this.currentUser.type === 'ADMIN' || this.currentUser.type === 'MANAGER') {
      
      switch (form.statut) {
        case 'COMPLETED':
          res = 'VALIDATE';
          break;
        case 'IN_PROGRESS':
          res = 'EDIT';
          break;
        case 'ARCHIVED':
          res = 'VIEW';
          break;
        case 'CANCELED':
          res = 'VIEW';
          break;
      }

    } else if (this.currentUser.type === 'USER') {

      const collab: Collaborateur = form.collaborateurs.find(u => u.idCollaborateur === this.currentUser._id);
      if (collab) {
        if (form.statut == 'IN_PROGRESS') {
          switch (collab.acces) {
            case 'EDITION':
              res = 'EDIT';
              break;
            case 'COMLETED':
              res = 'VIEW';
              break;
            case 'PREVIEW':
              res = 'VIEW';
              break;
            case 'CANCELED':
              res = 'VIEW';
              break;
          }
        } else {
          res = 'VIEW';
        }
      }

    }
    return res;
  }

  private sortACompleterAutres() {
    this.dashboardForms.forEach(form => {
      if(form.statut == 'IN_PROGRESS') {
        this.aCompleterCards.push(form);
      } else {
        this.autresCards.push(form);
      }
    })
  }

  private calculateCompletionRate(collaborateurs: Collaborateur[]): number {
    let nCollaborateursCompleted = 0;

    collaborateurs.forEach(collaborateur => {
      if(collaborateur.acces == 'COMPLETED' || collaborateur.acces == 'PREVIEW') {
        nCollaborateursCompleted++;
      }
    });

    return nCollaborateursCompleted * 100 / collaborateurs.length;
  }

  private searchAuthor(): Form[] {
    let results: Form[] = [];
    this.dashboardForms.forEach(form => {
      if (form.auteur.nom === this.searchName) {
          results.push(form);
        }
    });
    return(results);
  }

  private search() {
    if (this.searchName == "" && this.searchStatus == "" && 
        this.searchPatron == "" && this.dateFrom == null && this.dateTo == null)
    {
      this.desactivateSearch();
      return;
    }
    
    this.searchResult = this.dashboardForms;
    // à ajouter la maniere de gérer les combinaisons de filtres!!!
    if(this.searchName)
    {
      this.searchResult = this.searchAuthor();
    }

    if(this.searchStatus=='COMPLETED') {
        this.searchResult = this.searchCompleted();
    }

    if(this.searchStatus=='IN_PROGRESS')
    {
        this.searchResult = this.searchActive();
    }

    if(this.searchStatus=='ARCHIVED')
    {
        this.searchResult = this.searchArchived();
    }

    if(this.searchStatus=='CANCELED')
    {
        this.searchResult = this.searchCanceled();
    }

    if(this.searchPatron)
    {
        this.searchResult = this.searchId();
    }

    if(this.dateFrom) {
      this.searchResult = this.searchDateFrom();
    }

    if(this.dateTo) {
      this.searchResult = this.searchDateTo();
    }
    
    this.activateSearch();    
  }

  private activateSearch() {
    this.displayedCards = this.searchResult;
    this.searchActivated = true;
  }

  private desactivateSearch() {
    this.displayedCards = this.dashboardForms;
    this.searchActivated = false;
  }

  private searchCompleted(): Form[]
  {
    let results: Form[] = [];

    this.searchResult.forEach(form => {
      if(form.statut=='COMPLETED'){
        results.push(form);
      }
    });
    return(results);
  }

  

  private searchActive(): Form[]
  {
    let results: Form[] = [];

    this.searchResult.forEach(form => {
      if(form.statut=='IN_PROGRESS'){
        results.push(form);
      }
    })
      
    return(results);
  }

  private searchArchived(): Form[]
  {
    
    let results: Form[] = [];

    this.searchResult.forEach(form => {
      if(form.statut=='ARCHIVED'){
        results.push(form);
    }});

    return(results);
  }

  private searchCanceled(): Form[]
  {
    
    let results: Form[] = [];

    this.searchResult.forEach(form => {
      if(form.statut=='CANCELED'){
        results.push(form);
    }});

    return(results);
  }

  private searchId(): Form[]{

    let results: Form[] = [];
    
    this.searchResult.forEach(form => {
      if(form.nomFormulaire==this.searchPatron){
        results.push(form);
      }
    });
    return(results);
  }

  private searchDateFrom(): Form[]{
    
    let results: Form[] = [];
    this.searchResult.forEach(form => {
      let dateCreeLe = new Date(form.creeLe);

      if(dateCreeLe > this.dateFrom){
        results.push(form);
      }
    });
    return(results);
  }

  private searchDateTo(): Form[]{
    
    let results: Form[] = [];

    this.searchResult.forEach(form => {
      let dateCreeLe = new Date(form.creeLe);
      
      if(dateCreeLe < this.dateTo){
        results.push(form);
      }
    });
    return(results);
  }
}
