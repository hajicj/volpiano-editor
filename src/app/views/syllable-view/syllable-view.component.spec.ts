import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyllableViewComponent } from './syllable-view.component';

describe('SyllableViewComponent', () => {
  let component: SyllableViewComponent;
  let fixture: ComponentFixture<SyllableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyllableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyllableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
