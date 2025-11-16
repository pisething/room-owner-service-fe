import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesGridComponent } from './properties-grid.component';

describe('PropertiesGridComponent', () => {
  let component: PropertiesGridComponent;
  let fixture: ComponentFixture<PropertiesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertiesGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertiesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
