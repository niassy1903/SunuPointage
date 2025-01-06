import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprenantListCohorteComponent } from './apprenant-list-cohorte.component';

describe('ApprenantListCohorteComponent', () => {
  let component: ApprenantListCohorteComponent;
  let fixture: ComponentFixture<ApprenantListCohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprenantListCohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprenantListCohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
