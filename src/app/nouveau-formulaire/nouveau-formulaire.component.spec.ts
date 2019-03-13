import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauFormulaireComponent } from './nouveau-formulaire.component';

describe('NouveauFormulaireComponent', () => {
  let component: NouveauFormulaireComponent;
  let fixture: ComponentFixture<NouveauFormulaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NouveauFormulaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NouveauFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
