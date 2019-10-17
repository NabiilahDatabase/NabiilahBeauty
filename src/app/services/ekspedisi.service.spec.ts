import { TestBed } from '@angular/core/testing';

import { EkspedisiService } from './ekspedisi.service';

describe('EkspedisiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EkspedisiService = TestBed.get(EkspedisiService);
    expect(service).toBeTruthy();
  });
});
