import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolpianoRendererComponent } from './volpiano-renderer.component';

describe('VolpianoRendererComponent', () => {
  let component: VolpianoRendererComponent;
  let fixture: ComponentFixture<VolpianoRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VolpianoRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VolpianoRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
