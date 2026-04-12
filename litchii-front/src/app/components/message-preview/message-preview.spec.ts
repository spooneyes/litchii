import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePreviewComponent } from './message-preview';

describe('MessagePreview', () => {
  let component: MessagePreviewComponent;
  let fixture: ComponentFixture<MessagePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagePreviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessagePreviewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
