import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCohorteComponent } from './edit-cohorte.component';

describe('EditCohorteComponent', () => {
  let component: EditCohorteComponent;
  let fixture: ComponentFixture<EditCohorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCohorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCohorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
