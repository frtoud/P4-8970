import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnexeComponent } from './annexe.component';

describe('AnnexeComponent', () => {
  let component: AnnexeComponent;
  let fixture: ComponentFixture<AnnexeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnexeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnexeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
