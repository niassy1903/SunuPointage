import { TestBed } from '@angular/core/testing';

import { ActiveComponentService } from './active-component.service';

describe('ActiveComponentService', () => {
  let service: ActiveComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
