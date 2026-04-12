import { TestBed } from '@angular/core/testing';

import { PinStorage } from './pin-storage';

describe('PinStorage', () => {
  let service: PinStorage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinStorage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
