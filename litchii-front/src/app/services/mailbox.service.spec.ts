import { TestBed } from '@angular/core/testing';

import { Mailbox } from './mailbox.service';

describe('Mailbox', () => {
  let service: Mailbox;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Mailbox);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
