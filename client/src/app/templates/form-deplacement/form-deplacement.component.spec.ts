import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDeplacementComponent } from './form-deplacement.component';

describe('FormDeplacementComponent', () => {
  let component: FormDeplacementComponent;
  let fixture: ComponentFixture<FormDeplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDeplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDeplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
