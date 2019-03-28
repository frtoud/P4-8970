import { Component, OnInit, ViewChild, ComponentFactoryResolver, } from '@angular/core';
import { Router } from '@angular/router';

import { FormDirective } from './form-host.directive';

import { TemplateService, FormData } from '../services/template.service';

@Component({
  selector: 'app-nouveau-formulaire',
  templateUrl: './nouveau-formulaire.component.html',
  styleUrls: ['./nouveau-formulaire.component.css']
})
export class NouveauFormulaireComponent implements OnInit {

  FORMS_DATA : FormData[];
  formToDisplay = "DA";

  ngOnInit()
  {
    this.FORMS_DATA = this.formService.getForms();
    this.displayPreview(this.formService.getForms()[0]);
  }

  @ViewChild(FormDirective) formHost: FormDirective;
  constructor(private router: Router, private componentFactoryResolver: ComponentFactoryResolver, private formService : TemplateService) { }
  
  displayPreview(element) {
    this.formToDisplay = element.id;

    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(element.component);
    let viewContainerRef = this.formHost.viewContainerRef;
    viewContainerRef.clear();
    viewContainerRef.createComponent(componentFactory);

  }

  create(){
    this.router.navigate(['/new', this.formToDisplay]);
  }

}
