import { TestBed } from '@angular/core/testing';

import { CardStateServiceService } from './card-state-service.service';

describe('CardStateServiceService', () => {
  let service: CardStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
