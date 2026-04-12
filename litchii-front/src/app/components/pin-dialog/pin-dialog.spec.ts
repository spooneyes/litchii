import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinDialogComponent } from './pin-dialog';

describe('PinDialog', () => {
  let component: PinDialogComponent;
  let fixture: ComponentFixture<PinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PinDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
