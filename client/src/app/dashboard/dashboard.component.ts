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
// this.formStatus = ["IN_PROGRESS", "COMPLETED", "ARCHIVED"];
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
  loadedCards: Form[] = [];

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
            this.loadedCards = forms;
            console.log(forms);
          }).catch(err => console.log(err.error));
          break;
        case 'MANAGER':
          this.dashboardService.getForms(this.currentUser._id).then(forms => {
            this.sortCardsDecreasingDate(forms);
            this.dashboardForms = forms;
            this.displayedCards = forms;
            this.loadedCards = forms;
            console.log(forms);
          }).catch(err => console.log(err.error));
          break;
        case 'USER':
          this.dashboardService.getForms(this.currentUser._id).then(forms => {
            this.sortCardsDecreasingDate(forms);
            let collaborationForms: Form[] = this.searchAccesCollaborations(forms);
            this.dashboardForms = collaborationForms;
            this.dashboardForms = collaborationForms;
            this.displayedCards = collaborationForms;
            this.loadedCards = collaborationForms;
            console.log(forms);
          }).catch(err => console.log(err.error));
          break;
      }
    });
  }

  private sortCardsDecreasingDate(formArray: Form[]) {
    formArray.sort((vala, valb) => { return +valb.creeLe - +vala.creeLe });
  }

  private searchAccesCollaborations(forms: Form[]): Form[]
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

  // res = ["VALIDATE", "EDIT", "VIEW"];
  determineState(form: Form): string {
    let res = 'VIEW';
    let userIsAuthor = form.auteur.idAuteur === this.currentUser._id;
    // this.userAccess = ["WAITING", "EDITION", "COMPLETED", "PREVIEW"];
    // this.formStatus = ["IN_PROGRESS", "COMPLETED", "ARCHIVED"];
    
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
      }

    } else if (this.currentUser.type === 'USER') {

      const collab: Collaborateur = form.collaborateurs.find(u => u.idCollaborateur === this.currentUser._id);
      if (collab) {
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
        }
      }

    }
    return res;
  }

  private calculateCompletionRate(collaborateurs: Collaborateur[]): number {
    let nCollaborateursCompleted = 0;

    collaborateurs.forEach(collaborateur => {
      if(collaborateur.acces == "COMPLETED") {
        nCollaborateursCompleted++;
      }
    });

    return nCollaborateursCompleted * 100 / collaborateurs.length;
  }

  private searchAuthor(): Form[] {
    let results: Form[] = [];
    this.dashboardForms.forEach(form => {
      if (form.auteur.nom === this.searchName){
          console.log("found cardId: " + form.idForm);
          results.push(form);
        }
    });
    return(results);
  }

  private search(){

    
    this.searchResult = this.loadedCards;
    // à ajouter la maniere de gérer les combinaisons de filtres!!!
    if(this.searchName)
    {
      this.searchResult = this.searchAuthor();
    }

  
    console.log("search: " + this.searchStatus);
    if(this.searchStatus=="COMPLETED"){
        this.searchResult = this.searchCompleted();
    }
    

    if(this.searchStatus=="IN_PROGRESS")
    {
        console.log("searchStatus: calling searchActive");
        this.searchResult = this.searchActive();
    }

    if(this.searchStatus=="ARCHIVED")
    {
        console.log("searchStatus: calling searchArchived");
        this.searchResult = this.searchArchived();
    }

    if(this.searchPatron)
    {
        console.log("searchStatus: calling searchId");
        this.searchResult = this.searchId();
    }

    if(this.dateFrom){
      console.log("searchStatus: calling searchDateFrom");
      this.searchResult = this.searchDateFrom();
    }

    if(this.dateTo){
      console.log("searchStatus: calling searchDateTo");
      this.searchResult = this.searchDateTo();
    }

    this.displayedCards = this.searchResult;
    
  }

  private activateSearch(){
    this.displayedCards = this.searchResult;
    this.searchActivated = true;
  }

  private searchCompleted(): Form[]
  {
    let results: Form[] = [];

    this.searchResult.forEach(form => {
      
      if(form.statut=="COMPLETED"){
        results.push(form);
        console.log("found completed participation: " + form.idForm);
      }});
      return(results);
  }

  

  private searchActive(): Form[]
  {
    let results: Form[] = [];

    this.searchResult.forEach(form => {
      form.collaborateurs.forEach(collaborateur=>{
        if(collaborateur.idCollaborateur==this.currentUser._id){
          if(form.statut=="IN_PROGRESS"){
            results.push(form);
            console.log("card in progress found: cardID: "+ form.idForm +
            " collaborator status confirmation: " + collaborateur.acces +
            " collaborator: id:" + collaborateur.idCollaborateur +
            " name: "+ collaborateur.nom);
            
          }
        }
      })})
      
      return(results);
  }

  private searchArchived(): Form[]
  {
    
    let results: Form[] = [];

    this.searchResult.forEach(form => {
      if(form.statut=="ARCHIVED"){
        results.push(form);
        console.log("found archived participation: " + form.idForm);
    }});

    return(results);
  }

  private searchId(): Form[]{

    let results: Form[] = [];
    
    this.searchResult.forEach(form => {
      
    if(form.idForm==this.searchPatron){
      results.push(form);
      console.log("found patron: " + form.idForm);
    }});
    return(results);
  }

  private searchDateFrom(): Form[]{
    
    let results: Form[] = [];
    this.searchResult.forEach(form => {
      let dateCreeLe = new Date(form.creeLe);

      if(dateCreeLe > this.dateFrom){
        results.push(form);
    }});
    return(results);
  }

  private searchDateTo(): Form[]{
    
    let results: Form[] = [];

    this.searchResult.forEach(form => {
      let dateCreeLe = new Date(form.creeLe);
      
      if(dateCreeLe < this.dateTo){
        results.push(form);
    }});
    return(results);
  }
}
