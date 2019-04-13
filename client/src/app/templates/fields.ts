import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

export interface ISection {
    id: string;
    assigneA: string;
}

export interface ISignature {
    id: string;
    name: string;
    assigneA: string;
    value: string;
    date: Date;
}

export class Signature implements ISignature {
    id: string; // field ID
    name: string; // Nom à afficher comme label
    assigneA: string; // assigné à quel user
    value: string; // vide ou signé avec les noms de l'usager
    check: boolean; // coché
    validated: boolean; // signé & validé
    lock: boolean; // rendu impossible à modifier
    date: Date; // temps de la soumission de la signature

  constructor(id: string, name: string, assignedTo: string, value: string,
    check: boolean, validated: boolean, lock: boolean, date: Date = null) {
    this.id = id;
    this.name = name;
    this.assigneA = assignedTo;
    this.value = value;
    this.check = check;
    this.validated = validated;
    this.lock = lock;
    this.date = date;
  }
  public static fromInterface(sig: ISignature): Signature {
    const islock = sig.value !== '';
    return new Signature(sig.id, sig.name, sig.assigneA, sig.value, islock, islock, islock, sig.date);
  }

  public validerSignature() {
      // Signature possible si nom existant et case cochée
    this.validated = this.value.length > 0 && this.check;
    this.date = new Date();
  }
  public resetSignature() {
      // Annuler toute la signature
    this.validated = false;
    this.value = '';
    this.check = false;
    this.date = null;
  }

  public setData(sig: ISignature) {
    this.id = sig.id;
    this.name = sig.name;
    this.assigneA = sig.assigneA;
    this.value = sig.value;
    this.date = sig.date;

    const islocked = sig.value !== '';
    this.check = islocked;
    this.validated = islocked;
    this.lock = islocked;
  }

  public onButtonClick() {
    if (!this.lock) {
      if (this.validated) {
        this.resetSignature();
      } else {
        this.validerSignature();
      }
    }
  }

  public buttonMessage(): string {
    if (this.lock) {
      return '---';
    } else if (this.validated) {
      return 'ANNULER';
    } else {
      return 'SIGNER';
    }
  }

  public lockSignature() {
    this.lock = true;
  }
}

@Component({
  selector: 'app-sig-block',
  template: `
  <div id='signatures'>
    <div  *ngFor="let sig of signatures" >
      <div class="signature" id={{sig.id}}>
        <mat-form-field>
          <input matInput type="text" placeholder="{{sig.name}}" [disabled]="sig.lock || sig.validated" [(ngModel)]="sig.value">
          <mat-hint *ngIf="sig.name.length == 0">
            Le nom et le prénom sont obligatoires!
          </mat-hint>
        </mat-form-field>
        <mat-checkbox [(ngModel)]="sig.check" [disabled]="sig.lock || sig.validated" color="primary">
            Je confirme et j'accepte la véracité des informations ci-dessus.
        </mat-checkbox>
        <br>
        <button mat-raised-button [disabled]="sig.value.length <= 0 || sig.lock || !sig.check" 
        (click)="sig.onButtonClick(); controls.updateValueAndValidity()">{{sig.buttonMessage()}}</button>
      </div>
    </div>
  </div>`,
  styleUrls: ['./signature.css'],
})
export class SignatureBlockComponent {
  @Input()
  signatures: Signature[];
  @Input()
  controls: AbstractControl;
}
