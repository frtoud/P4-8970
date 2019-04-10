import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DashboardService, Form, Collaborateur } from '../services/dashboard.service';
import { LoginService, AuthenticatedUser } from '../services/login.service';
import { Router } from '@angular/router';

import { UserService, User } from '../services/users.service';
import { Observable } from 'rxjs';

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
  cardCollaborateurs: string[] = ['collaborateursList'];
  vueListeColumns: string[] = ['idForm', 'auteur', 'collaborateurs', 'statut', 'modifieLe', 'creeLe', 'modifier'];

  searchAutocompleteName: User;
  searchName: string = null;
  searchStatus: string = '';
  searchPatron: string = '';
  vueCarte: string = 'false';
  loadingForms: boolean = true;
  searchActivated: boolean = false;

  dateFrom: Date;
  dateTo: Date;

  searchResult: Form[] = [];
  dashboardForms: Form[] = [];
  displayedCards: Form[] = [];
  aCompleterCards: Form[] = [];
  autresCards: Form[] = [];

  currentUser: AuthenticatedUser;
  
  // ------ autocomplete ------
  listCollaborateurs: User[];
  form: FormControl = new FormControl();
  filteredOptions: Observable<User[]>;

  constructor(public dialog: MatDialog, private breakpointObserver: BreakpointObserver,
    private dashboardService: DashboardService, private userService: UserService,
    private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    this.loginService.getUser().then(login => {

      this.currentUser = login;

      switch (this.currentUser.type) {
        case 'ADMIN':
          this.dashboardService.getAllForms().then(forms => {
            this.sortCardsDecreasingDate(forms);
            this.dashboardForms = forms;
            this.displayedCards = forms;
            this.separateACompleterAndAutres();
            this.loadingForms = false;
          }).catch(err => console.log(err.error));
          break;
        case 'MANAGER':
          this.dashboardService.getForms(this.currentUser._id).then(forms => {
            this.sortCardsDecreasingDate(forms);
            this.dashboardForms = forms;
            this.displayedCards = forms;
            this.separateACompleterAndAutres();
            this.loadingForms = false;
          }).catch(err => console.log(err.error));
          break;
        case 'USER':
          this.dashboardService.getForms(this.currentUser._id).then(forms => {
            this.sortCardsDecreasingDate(forms);
            const collaborationForms: Form[] = this.searchUserAccesCollaborations(forms);
            this.dashboardForms = collaborationForms;
            this.displayedCards = collaborationForms;
            this.separateACompleterAndAutres();
            this.loadingForms = false;
          }).catch(err => console.log(err.error));
          break;
      }

    });
    this.userService.getAllUsers().then(list => {
      this.listCollaborateurs = list;
      this.filteredOptions = this.form.valueChanges
      .pipe(
        startWith<string | User>(''),
        map(value => typeof value === 'string' ? value : ""),
        map(user => user ? this.filtrer(user) : this.listCollaborateurs.slice())
      );
    });

    let vue = sessionStorage.getItem("vue");

    
    if(vue==="true") {
      this.vueCarte = 'true';
    }
    else if(vue==="false") {
      this.vueCarte = 'false';
    }
  }
  
  toggleVueCarte() {
    this.vueCarte = 'true';
    
    sessionStorage.setItem("vue", "true");
    
  }
  toggleVueListe() {
    this.vueCarte = 'false';
    
    sessionStorage.setItem("vue", "false");
  }

  displayFn(user?: User): string | undefined {
    return user ? user.firstName + ' ' + user.lastName : undefined;
  }

  private filtrer(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.listCollaborateurs.filter(option => ( //TODOkete: filtrer sur tout le string
         option.firstName.toLowerCase().indexOf(filterValue) === 0
      || option.lastName.toLowerCase().indexOf(filterValue) === 0
    )
    );
  }

  // https://stackoverflow.com/questions/10123953/sort-javascript-object-array-by-date
  private sortCardsDecreasingDate(forms: Form[]) {
    forms.sort(function(a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      const dateA = new Date(a.creeLe);
      const dateB = new Date(b.creeLe);
      return +dateB - +dateA;
    });
  }

  private searchUserAccesCollaborations(forms: Form[]): Form[] {
    const results: Form[] = [];

    forms.forEach(form => {
      form.collaborateurs.forEach(collaborateur => {
        if (collaborateur.idCollaborateur === this.currentUser._id) {
          if (collaborateur.acces === 'EDITION' ||
              collaborateur.acces === 'COMPLETED' ||
              collaborateur.acces === 'PREVIEW') {
                results.push(form);
          }
        }
      });
    });

    return results;
  }

  // return values : res = ["VALIDATE", "EDIT", "VIEW"];
  determineState(form: Form): string {
    let res = 'VIEW';
    const userIsAuthor = form.auteur.idAuteur === this.currentUser._id;

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
        if (form.statut === 'IN_PROGRESS') {
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

  private separateACompleterAndAutres() {
    this.dashboardForms.forEach(form => {
      if (form.statut === 'IN_PROGRESS') {
        this.aCompleterCards.push(form);
      } else {
        this.autresCards.push(form);
      }
    });
  }

  private calculateCompletionRate(collaborateurs: Collaborateur[]): number {
    let nCollaborateursCompleted = 0;

    collaborateurs.forEach(collaborateur => {
      if (collaborateur.acces === 'COMPLETED' || collaborateur.acces === 'PREVIEW') {
        nCollaborateursCompleted++;
      }
    });

    return nCollaborateursCompleted * 100 / collaborateurs.length;
  }

  private activateSearch() {
    this.displayedCards = this.searchResult;
    this.searchActivated = true;
  }

  private desactivateSearch() {
    this.searchName = null;
    this.form.setValue(null);
    this.searchStatus = null;
    this.searchPatron = null;
    this.dateFrom = null;
    this.dateTo = null;
    this.displayedCards = this.dashboardForms;
    this.searchActivated = false;
  }

  private search() {
    let searchString = this.form.value;
    this.searchName = typeof searchString === 'string' ? searchString : this.displayFn(searchString);
    
    if ((this.searchName === '' || this.searchName == undefined) &&
        (this.searchStatus === '' || this.searchStatus == undefined) &&
        (this.searchPatron === '' || this.searchPatron == undefined) &&
         this.dateFrom == null &&
         this.dateTo == null) {
        return;
    }

    this.searchResult = this.dashboardForms;
    // à ajouter la maniere de gérer les combinaisons de filtres!!!
    if (this.searchName) {
        this.searchResult = this.searchAuthor();
    }

    if (this.searchStatus === 'COMPLETED') {
        this.searchResult = this.searchCompleted();
    }

    if (this.searchStatus === 'IN_PROGRESS') {
        this.searchResult = this.searchActive();
    }

    if (this.searchStatus === 'ARCHIVED') {
        this.searchResult = this.searchArchived();
    }

    if (this.searchStatus === 'CANCELED') {
        this.searchResult = this.searchCanceled();
    }

    if (this.searchPatron) {
        this.searchResult = this.searchId();
    }

    if (this.dateFrom) {
      this.searchResult = this.searchDateFrom();
    }

    if (this.dateTo) {
      this.searchResult = this.searchDateTo();
    }
    
    this.activateSearch();
  }

  private searchAuthor(): Form[] {
    const results: Form[] = [];
    this.dashboardForms.forEach(form => {
      if (form.auteur.nom === this.searchName) {
          results.push(form);
        }
    });
    return(results);
  }

  private searchCompleted(): Form[] {
    const results: Form[] = [];

    this.searchResult.forEach(form => {
      if (form.statut === 'COMPLETED') {
        results.push(form);
      }
    });
    return(results);
  }

  private searchActive(): Form[] {
    const results: Form[] = [];

    this.searchResult.forEach(form => {
      if (form.statut === 'IN_PROGRESS') {
        results.push(form);
      }
    });

    return(results);
  }

  private searchArchived(): Form[] {

    const results: Form[] = [];

    this.searchResult.forEach(form => {
      if (form.statut === 'ARCHIVED') {
        results.push(form);
    }});

    return(results);
  }

  private searchCanceled(): Form[] {

    const results: Form[] = [];

    this.searchResult.forEach(form => {
      if (form.statut === 'CANCELED') {
        results.push(form);
    }});

    return(results);
  }

  private searchId(): Form[] {

    const results: Form[] = [];

    this.searchResult.forEach(form => {
      if (form.nomFormulaire === this.searchPatron) {
        results.push(form);
      }
    });
    return(results);
  }

  private searchDateFrom(): Form[] {

    const results: Form[] = [];
    this.searchResult.forEach(form => {
      const dateCreeLe = new Date(form.creeLe);

      if (dateCreeLe > this.dateFrom) {
        results.push(form);
      }
    });
    return(results);
  }

  private searchDateTo(): Form[] {

    const results: Form[] = [];

    this.searchResult.forEach(form => {
      const dateCreeLe = new Date(form.creeLe);

      if (dateCreeLe < this.dateTo) {
        results.push(form);
      }
    });
    return(results);
  }

  private redirectTo(arg: string[]) {
    console.log(arg);
    this.router.navigate(arg);
  }
}
