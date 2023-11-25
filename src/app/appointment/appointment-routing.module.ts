import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingComponent } from './booking/booking.component';
import { CalenderComponent } from './calender/calender.component';
import { ScheduleListComponent } from './schedule-list/schedule-list.component';

const routes: Routes = [
  {
		path: '',
		redirectTo: 'list',
		pathMatch: 'full',
	},
  {
    path: 'list',
    component: ScheduleListComponent,
  },
  {
    path: 'calendar',
    component: CalenderComponent,
  },
  {
    path: 'booking',
    component: BookingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
