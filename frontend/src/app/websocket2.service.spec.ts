import { TestBed } from '@angular/core/testing';

import { Websocket2Service } from './websocket2.service';

describe('Websocket2Service', () => {
  let service: Websocket2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Websocket2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
