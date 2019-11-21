import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLanguageStringComponent } from './multi-language-string.component';

describe('MultiLanguageStringComponent', () => {
  let component: MultiLanguageStringComponent;
  let fixture: ComponentFixture<MultiLanguageStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiLanguageStringComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLanguageStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
