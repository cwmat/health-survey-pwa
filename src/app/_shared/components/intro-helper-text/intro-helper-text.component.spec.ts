import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroHelperTextComponent } from './intro-helper-text.component';

describe('IntroHelperTextComponent', () => {
  let component: IntroHelperTextComponent;
  let fixture: ComponentFixture<IntroHelperTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntroHelperTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroHelperTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
