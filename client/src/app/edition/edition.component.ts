import { Component, ComponentFactoryResolver, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDirective } from '../nouveau-formulaire/form-host.directive';
import { Instance, InstanceService } from '../services/instance.service';
import { AuthenticatedUser, LoginService } from '../services/login.service';
import { FormData, TemplateService } from '../services/template.service';
import { UserService } from '../services/users.service';
import { BaseFormComponent } from '../templates/base-form.component';
import { Tile } from '../assignation/assignation.component';
import { FileUploaderComponent } from '../file-uploader/file-uploader.component';
import { Collaborateur } from '../services/instance.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FeedbackDialogComponent, FeedbackDialogData } from '../feedback-dialog/feedback-dialog.component';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {

  @ViewChild(FormDirective) formHost: FormDirective;
  @ViewChild(FileUploaderComponent) fileUploader: FileUploaderComponent;
  formInstance: BaseFormComponent;
  currentForm: FormData;
  oldData: any;
  metadata: Instance;
  formId: string;
  state: string; // modify, view, validate
  displaying = true;

  canSubmit = false;
  canValidate = false;
  canCopy = false;
  canCancel = false;

  participants: Collaborateur[] = [];

  tiles = [
    {cols: 1, rows: 1 },
    {cols: 1, rows: 1 },
    {cols: 2, rows: 2 },
  ];

  displayProgressSpinner: boolean = false;

  public static getDiff(obj: any, ref: any): any {
    return Object.keys(ref).reduce((diff, key) => {
      if ( typeof ref[key] === 'object' && ref[key] !== null) {
        const recurs = EditionComponent.getDiff(obj[key], ref[key]);

        if (Object.keys(recurs).length !== 0) {
          diff[key] = recurs;
        }
      } else if (ref[key] !== obj[key]) {
        diff[key] = obj[key];
      }
      return diff;
    }, {});
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    private templateService: TemplateService,
    private userService: UserService,
    private instanceService: InstanceService,
    private router: Router, private route: ActivatedRoute,
    private loginService: LoginService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.state = this.route.snapshot.paramMap.get('state');
    const id = this.route.snapshot.paramMap.get('id');
    this.instanceService.getInstance(id).then(form => {
        this.metadata = form;
        const tokens = form.idForm.split('-');
        const templateID = tokens[0];
        this.formId = tokens[1];
        this.participants = this.metadata.collaborateurs;
        const element = this.templateService.getForm(templateID);
        if (element) {
          this.currentForm = element;
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(element.component);
          const viewContainerRef = this.formHost.viewContainerRef;
          viewContainerRef.clear();
          this.formInstance = viewContainerRef.createComponent(componentFactory).instance as BaseFormComponent;
          this.InitFormData(form);
        } else {
          // WRONG ID!!
          this.openDialog("error", "Une erreur est survenue!", true);
        }

      }).catch(reason => {
        this.openDialog("error", reason, true);
        });
  }

  InitFormData(form: Instance) {
    this.fileUploader.attachedFiles = form.attachements;
      this.formInstance.setInterface(form.data);
    this.loginService.getUser().then(user => {
      this.formInstance.setUserEdition(user, this.state !== 'view');
      const isAuthor = user.type !== 'USER' ; // && this.metadata.auteur.idAuteur === user._id;
      this.formInstance.controls.statusChanges.subscribe(() => {
        const validationcheck = this.formInstance.getFormValidation(user, isAuthor);
        this.canSubmit = validationcheck || isAuthor;
        this.canValidate = validationcheck && isAuthor;
      });
      if (isAuthor) {
        this.canCopy = this.metadata.statut === 'ARCHIVED' || this.metadata.statut === 'CANCELED';
        this.canCancel = this.metadata.statut !== 'CANCELED';
      }
      //Todokete: delet this (or maybe not)
      this.formInstance.controls.updateValueAndValidity();
    });
  }

  onSend() {
    this.displayProgressSpinner = true;
    const newData = this.formInstance.getInterface();
    // const diffData = EditionComponent.getDiff(newData, this.oldData);

    this.instanceService.patchInstance(this.formId, this.formInstance.collaborateurID,
    newData, this.fileUploader.attachedFiles).then(res => {
      this.displayProgressSpinner = false;
      this.openDialog("check_circle", "Modifications soumises avec succès!", false);
    }).catch(err => {
      this.displayProgressSpinner = false;
      this.openDialog("error", "Une erreur est survenue!", true);
    });
  }
  onValidate() {
    this.displayProgressSpinner = true;
    const newData = this.formInstance.getInterface();
    // const diffData = EditionComponent.getDiff(newData, this.oldData);

    this.instanceService.patchInstance(this.formId, this.formInstance.collaborateurID,
    newData, this.fileUploader.attachedFiles).then(res => {
      this.instanceService.validateInstance(this.formId)
      .then(resp => {
        this.displayProgressSpinner = false;
        this.openDialog("check_circle", "Formulaire validé!", false);
      }).catch(err => {
        this.displayProgressSpinner = false;
        this.openDialog("error", "Une erreur est survenue lors de la validation!", true);
      });
    }).catch(err => {
      this.displayProgressSpinner = false;
      this.openDialog("error", "Une erreur est survenue lors de la validation!", true);
    });
  }

  onCopy() {
    this.router.navigate(['/new', this.currentForm.id], { queryParams: { ref: this.formId } });
  }

  onCancel() {
    this.displayProgressSpinner = true;
    this.instanceService.cancelInstance(this.formId).then(res => {
      this.displayProgressSpinner = false;
      this.openDialog("check_circle", "Formulaire annulé!", false);
    }).catch(err => {
      this.displayProgressSpinner = false;
      this.openDialog("error", "Une erreur est survenue lors de l'annulation!", true);
    });
  }

  onReturn() {
    this.router.navigate(['/dashboard']);
  }

  printDiv() {
    window.print();
  }

  openDialog(icon: string, message: string, error: boolean): void {
    this.dialog.open(FeedbackDialogComponent, {
      width: '300px',
      data: { icon: icon, error: error, message: message }
    });
    this.router.navigate(['/dashboard']);
  }
}

