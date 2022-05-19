import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadOfflineComponent } from './upload-offline.component';

describe('UploadOfflineComponent', () => {
  let component: UploadOfflineComponent;
  let fixture: ComponentFixture<UploadOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadOfflineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
