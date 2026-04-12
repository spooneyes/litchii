import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailboxCreate } from './mailbox-create';

describe('MailboxCreate', () => {
  let component: MailboxCreate;
  let fixture: ComponentFixture<MailboxCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailboxCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(MailboxCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
