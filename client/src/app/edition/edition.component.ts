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
    private loginService: LoginService) { }

  ngOnInit() {
    this.state = this.route.snapshot.paramMap.get('state');
    console.log('state: ' + this.state);
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
          console.log('Init');
          this.formInstance = viewContainerRef.createComponent(componentFactory).instance as BaseFormComponent;
          this.InitFormData(form);
        } else {
          // WRONG ID!!
          window.alert('erreur avec le formulaire');
          this.router.navigate(['/dashboard']);
        }

      }).catch(reason => {
          console.log(reason);
          window.alert('erreur avec le formulaire:' + reason);
          this.router.navigate(['/dashboard']);
        });
  }

  InitFormData(form: Instance) {
    this.fileUploader.attachedFiles = form.attachements;
      this.formInstance.setInterface(form.data);
    this.loginService.getUser().then(user => {
      this.formInstance.setUserEdition(user, this.state !== 'view');
      const isAuthor = user.type !== 'USER' && this.metadata.auteur.idAuteur === user._id;
      this.formInstance.controls.statusChanges.subscribe(() => {
        const validationcheck = this.formInstance.getFormValidation(user, isAuthor);
        this.canSubmit = validationcheck || isAuthor;
        this.canValidate = validationcheck && isAuthor;
        console.log(this.canSubmit);
      });
      if (isAuthor) {
        this.canCopy = this.metadata.statut === 'ARCHIVED' || this.metadata.statut === 'CANCELED';
        this.canCancel = this.metadata.statut !== 'CANCELED';
      }
    });
  }

  onSend() {
    console.log('SENT');
    const newData = this.formInstance.getInterface();
    console.log(newData);
    // const diffData = EditionComponent.getDiff(newData, this.oldData);

    this.instanceService.patchInstance(this.formId, this.formInstance.collaborateurID,
    newData, this.fileUploader.attachedFiles).then(res => {
      this.router.navigate(['/dashboard']);
    }).catch(err => {
      window.alert('erreur avec le formulaire:' + err);
      this.router.navigate(['/dashboard']);
    });
  }
  onValidate() {
    const newData = this.formInstance.getInterface();
    // const diffData = EditionComponent.getDiff(newData, this.oldData);

    this.instanceService.patchInstance(this.formId, this.formInstance.collaborateurID,
    newData, this.fileUploader.attachedFiles).then(res => {
      console.log(res);
      this.instanceService.validateInstance(this.formId)
      .then(resp => {
        console.log(resp);
        window.alert('formulaire validé.');
        this.router.navigate(['/dashboard']);
      }).catch(err => {
        window.alert('erreur lors de la validation:' + err);
      });
    }).catch(err => {
      window.alert('erreur lors de la validation:' + err);
    });
  }

  onCopy() {
    this.router.navigate(['/new', this.currentForm.id], { queryParams: { ref: this.formId } });
  }
  onCancel() {
    this.instanceService.cancelInstance(this.formId).then(res => {
      window.alert('formulaire invalidé');
      this.router.navigate(['/dashboard']);
    }).catch(err => {
      window.alert('erreur de création');
    });
  }
  onReturn() {
    this.router.navigate(['/dashboard']);
  }

  printDiv() {

    window.print();
}
}

