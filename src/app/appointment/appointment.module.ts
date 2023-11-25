import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { AppointmentRoutingModule } from './appointment-routing.module';
import { CalenderComponent } from './calender/calender.component';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';
import { BookingComponent } from './booking/booking.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [CalenderComponent, ScheduleListComponent, BookingComponent],
  imports: [
    CommonModule,
    AppointmentRoutingModule,
    FormsModule, ReactiveFormsModule,
    NgxPaginationModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NgbModule
  ]
})
export class AppointmentModule { }
