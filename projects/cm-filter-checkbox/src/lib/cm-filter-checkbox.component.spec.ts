import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmFilterCheckboxComponent } from './cm-filter-checkbox.component';

describe('CmFilterCheckboxComponent', () => {
  let component: CmFilterCheckboxComponent;
  let fixture: ComponentFixture<CmFilterCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmFilterCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmFilterCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
