import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequirementSearchModalComponent } from './requirement-search-modal.component';

describe('RequirementSearchModalComponent', () => {
  let component: RequirementSearchModalComponent;
  let fixture: ComponentFixture<RequirementSearchModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RequirementSearchModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequirementSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
