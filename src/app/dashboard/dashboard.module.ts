import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProProfileComponent } from './pro-profile/pro-profile.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { MyAppointmentComponent } from './my-appointment/my-appointment.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { DoctorHoursComponent } from './doctor-hours/doctor-hours.component';
import { HoursComponent } from './hours/hours.component';
import { FavoritesComponent } from './favorites/favorites.component';

@NgModule({
  declarations: [DashboardComponent, EditProfileComponent, ProProfileComponent, MyAppointmentComponent, DoctorHoursComponent, HoursComponent, FavoritesComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    GooglePlaceModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MultiselectDropdownModule
  ]
})
export class DashboardModule { }
