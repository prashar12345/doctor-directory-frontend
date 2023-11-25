import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorHoursComponent } from './doctor-hours.component';

describe('DoctorHoursComponent', () => {
  let component: DoctorHoursComponent;
  let fixture: ComponentFixture<DoctorHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
