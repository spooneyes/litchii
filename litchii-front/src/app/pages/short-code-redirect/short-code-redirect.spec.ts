import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortCodeRedirect } from './short-code-redirect';

describe('ShortCodeRedirect', () => {
  let component: ShortCodeRedirect;
  let fixture: ComponentFixture<ShortCodeRedirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortCodeRedirect],
    }).compileComponents();

    fixture = TestBed.createComponent(ShortCodeRedirect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
