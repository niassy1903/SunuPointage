import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepartementComponent } from './add-departement.component';

describe('AddDepartementComponent', () => {
  let component: AddDepartementComponent;
  let fixture: ComponentFixture<AddDepartementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDepartementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDepartementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
