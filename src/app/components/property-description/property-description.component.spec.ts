import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDescriptionComponent } from './property-description.component';

describe('PropertyDescriptionComponent', () => {
  let component: PropertyDescriptionComponent;
  let fixture: ComponentFixture<PropertyDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyDescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
