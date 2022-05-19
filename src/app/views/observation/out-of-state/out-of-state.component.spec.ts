import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutOfStateComponent } from './out-of-state.component';

describe('OutOfStateComponent', () => {
  let component: OutOfStateComponent;
  let fixture: ComponentFixture<OutOfStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutOfStateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutOfStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
