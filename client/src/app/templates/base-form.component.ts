import { AfterViewInit } from '@angular/core';
import { Signature, ISignature, ISection } from './fields';
import { User } from '../services/users.service';
import { strictEqual } from 'assert';

export abstract class BaseFormComponent implements AfterViewInit {

    date_creation: Date = new Date();

    collaborateurID = null;
    captureActive = false;

    coloring = true;
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
      this.doColoring();
    }

    public setUserEdition(user: User, coloring: boolean) {
      this.collaborateurID = user._id;
      this.coloring = coloring;
      // ADMIN et MANAGER ont droit à tout; pas besoin de check
      this.edition = user.type === 'USER';
    }

    public editDisable() {
      this.sections.forEach(element => {
        if (element.assigneA !== this.collaborateurID) {
          document.getElementById(element.id).classList.add('child_disabled');
        }
      });

      for (const sig of this.signatures) {
        if (sig.assigneA !== this.collaborateurID) {
          document.getElementById(sig.id).classList.add('child_disabled');
        }
      }
    }

    public doColoring() {
      this.sections.forEach(element => {
        this.recolor(element);
      });
      for (const sig of this.signatures) {
        this.recolor(sig);
      }
    }
    public recolor(section: ISection) {
        const elem = document.getElementById(section.id);
        if (!this.coloring || section.assigneA === null) {
          elem.classList.remove('assignation_selected');
          elem.classList.remove('assignation_assigned');
        } else if (section.assigneA === this.collaborateurID) {
          elem.classList.add('assignation_selected');
          elem.classList.remove('assignation_assigned');
        } else {
          elem.classList.remove('assignation_selected');
          elem.classList.add('assignation_assigned');
        }
      }

    public startAssignation(userid) {
        this.captureActive = true;
        this.collaborateurID = userid;
        this.disableInputs();
        this.doColoring();
    }
    public stopAssignation() {
        this.collaborateurID = null;
        this.captureActive = false;
        this.enableInputs();
        this.doColoring();
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
        if (section.assigneA === this.collaborateurID) {
          section.assigneA = null;
        } else {
          section.assigneA = this.collaborateurID;
        }
        this.doColoring();
      }
    }

    public disableInputs() {
      this.sections.forEach(element => {
          document.getElementById(element.id).classList.add('child_disabled');
      });
      for (const sig of this.signatures) {
          document.getElementById(sig.id).classList.add('child_disabled');
      }
    }
    public enableInputs() {
      this.sections.forEach(element => {
          document.getElementById(element.id).classList.remove('child_disabled');
      });

      for (const sig of this.signatures) {
          document.getElementById(sig.id).classList.remove('child_disabled');
      }
    }

    getAssignations(): Set<string> {
      const list: Set<string> = new Set<string>();
      this.sections.forEach(s => { list.add(s.assigneA); });
      this.signatures.forEach(s => { list.add(s.assigneA); });
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

    clearSignatures(): void {
      this.signatures.forEach(sig => {
        sig.resetSignature();
        sig.lock = false;
        sig.date = null;
      });
    }
    abstract setSections();
}
