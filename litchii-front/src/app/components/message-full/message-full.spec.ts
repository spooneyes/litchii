import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageFullComponent } from './message-full';

describe('MessageFull', () => {
  let component: MessageFullComponent;
  let fixture: ComponentFixture<MessageFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageFullComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageFullComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
