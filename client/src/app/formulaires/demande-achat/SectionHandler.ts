import {Section} from './Section';
export class SectionHandler {
  sections = [
    new Section('entite-externe', '#ffffff', -1),
    new Section('beneficiaire-demandeur', '#ffffff', -1),
    new Section('beneficiaire', '#ffffff', -1),
    new Section('demandeur', '#ffffff', -1),
    new Section('nouveau-fournisseur', '#ffffff', -1),
    new Section('description-facture', '#ffffff', -1),
    new Section('ventilation-budgetaire', '#ffffff', -1),
    new Section('signature-demandeur', '#ffffff', -1),
    new Section('signature-ubr', '#ffffff', -1),
    new Section('signature-sup', '#ffffff', -1),
    new Section('signature-finance', '#ffffff', -1),
  ];
  constructor() {}
  updateSectionAssign(id, usrIdx) {
    for (let i = 0; i < this.sections.length; i++) {
      if (this.sections[i].name === id) {
        this.sections[i].assignedToIdx = usrIdx;
      }
    }
  }
  findSectionColor(sectionName) {
    for (let i = 0; i < this.sections.length; i++) {
      if (this.sections[i].name === sectionName) {
        return this.sections[i].color;
      }
    }
  }
  updateSectionColor(sectionName, color) {
    for (let i = 0; i < this.sections.length; i++) {
      if (this.sections[i].name === sectionName) {
        this.sections[i].color = color;
      }
    }
  }
  getSectionAssign(id) {
    for (let i = 0; i < this.sections.length; i++) {
      if (this.sections[i].name === id) {
        return this.sections[i].assignedToIdx;
      }
    }
    return -1;
  }
}
