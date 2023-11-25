import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ProProfileComponent } from './pro-profile/pro-profile.component';
import { MyAppointmentComponent } from './my-appointment/my-appointment.component';
import { HoursComponent } from './hours/hours.component';
import { FavoritesComponent } from './favorites/favorites.component';

const routes: Routes = [
  {
		path: '',
		// redirectTo: 'dashboard',
		pathMatch: 'full',
	},
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'profile',
    component: EditProfileComponent,
  },
  {
    path: 'pro-profile',
    component: ProProfileComponent,
  },
  {
    path: 'myappointments',
    component: MyAppointmentComponent,
  },
  {
    path: 'myfavorites',
    component: FavoritesComponent,
  },
  {
    path: 'hoursofoperation',
    component: HoursComponent,
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
