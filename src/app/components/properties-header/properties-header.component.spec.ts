import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesHeaderComponent } from './properties-header.component';

describe('PropertiesHeaderComponent', () => {
  let component: PropertiesHeaderComponent;
  let fixture: ComponentFixture<PropertiesHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
