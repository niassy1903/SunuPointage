import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CohorteComponent } from './cohorte.component';

describe('CohorteComponent', () => {
  let component: CohorteComponent;
  let fixture: ComponentFixture<CohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
