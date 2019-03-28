import { AfterViewInit } from '@angular/core';
import { Signature } from './fields';
import { User } from '../services/users.service';

export abstract class BaseFormComponent implements AfterViewInit {

    collaborateurID = null;
    captureActive = false;

    edition = false;

    public sections: any[];
    public signatures: Signature[];

    public static getHighestId(table: { id: number }[]): number {
      let n = 0;
      table.map(v => {
        n = v.id > n ? v.id : n;
      });
      return n;
    }


    public addListeners() {
      this.setSections();
      this.sections.forEach(element => {
        document.getElementById(element.id).addEventListener('click', (event) => this.captureAssignation(event, element), true);
      });

      for (const sig of this.signatures) {
        document.getElementById(sig.id).addEventListener('click', (event) => this.captureAssignation(event, sig) , true);
      }

      if (this.edition) { this.editDisable(); }
    }

    public setUserEdition(user: User) {
      this.collaborateurID = user._id;

      // ADMIN et MANAGER ont droit à tout; pas besoin de check
      this.edition = user.type === 'USER';

    }

    public editDisable() {
        this.sections.forEach(element => {
          if (element.assigneA !== this.collaborateurID) {
            document.getElementById(element.id).classList.add('form_disabled');
          }
        });

        for (const sig of this.signatures) {
          if (sig.assigneA !== this.collaborateurID) {
            document.getElementById(sig.id).classList.add('form_disabled');
          }
        }
    }

    public startAssignation(userid) {
        this.captureActive = true;
        this.collaborateurID = userid;
        this.disableInputs();
    }
    public stopAssignation() {
        this.collaborateurID = null;
        this.captureActive = false;
        this.enableInputs();
    }

    public removeAssignation(user: string) {
      this.sections.forEach(element => {
        if (element.assigneA === user) {
          element.assigneA = null;
        }
      });
    }

  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    this.addListeners();
  }

    captureAssignation(event, section) {
      if (this.captureActive) {
        // TODOKETE: STOP THAT EVENT!
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.cancelBubble = true;
        console.log(event);
        if (section.assigneA === this.collaborateurID) {
          section.assigneA = null;
        } else {
          section.assigneA = this.collaborateurID;
        }
      }
    }

    // Hack-ish way to disable inputs
    disableInputs() {
      document.querySelectorAll('input').forEach( (element) => {
         element.toggleAttribute('readonly', true);
      });
    }
    enableInputs() {
      document.querySelectorAll('input').forEach( (element) => {
           element.toggleAttribute('readonly', false);
      });
    }

    getAssignations(): Set<string> {
      const list: Set<string> = new Set<string>();
      this.sections.forEach(s => {
        list.add(s.assigneA);
      });
      return list;
    }

    getInterface() {
      const obj: any = {};
      this.sections.forEach(s => {
        obj[s.id] = s;
      });
      obj.signatures = this.signatures;
      return obj;
    }

    setInterface(data: any) {
      // Deep copy
      Object.assign(this, JSON.parse(JSON.stringify(data)));
      this.signatures = [];
      data.signatures.forEach(sig => {
        this.signatures.push(Signature.fromInterface(sig));
      });
      this.setSections();
    }

    abstract setSections();
}
