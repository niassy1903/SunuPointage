import { TestBed } from '@angular/core/testing';

import { HistoricPointageService } from './historic-pointage.service';

describe('HistoricPointageService', () => {
  let service: HistoricPointageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricPointageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
