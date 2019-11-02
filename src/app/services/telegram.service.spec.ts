import { TestBed } from '@angular/core/testing';

import { TelegramService } from './telegram.service';

describe('TelegramService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TelegramService = TestBed.get(TelegramService);
    expect(service).toBeTruthy();
  });
});
