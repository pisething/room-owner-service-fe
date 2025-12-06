import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomUploadComponent } from './room-upload.component';

describe('RoomUploadComponent', () => {
  let component: RoomUploadComponent;
  let fixture: ComponentFixture<RoomUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
