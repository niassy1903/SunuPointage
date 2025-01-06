import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCohorteComponent } from './add-cohorte.component';

describe('AddCohorteComponent', () => {
  let component: AddCohorteComponent;
  let fixture: ComponentFixture<AddCohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
