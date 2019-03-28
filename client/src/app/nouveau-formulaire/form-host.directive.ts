import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[formhost]',
  })
  export class FormDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
  }