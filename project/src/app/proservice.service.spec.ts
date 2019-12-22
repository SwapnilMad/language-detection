import { TestBed } from '@angular/core/testing';

import { ProserviceService } from './proservice.service';

describe('ProserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProserviceService = TestBed.get(ProserviceService);
    expect(service).toBeTruthy();
  });
});
