import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SignupComponent } from './signup/signup.component';
import { PatientSignupComponent } from './patient-signup/patient-signup.component';
import { DoctorSignupComponent } from './doctor-signup/doctor-signup.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

@NgModule({
  declarations: [LoginComponent, ForgotComponent, ResetComponent, ChangePasswordComponent, SignupComponent, PatientSignupComponent, DoctorSignupComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    GooglePlaceModule,
    MultiselectDropdownModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class AuthModule { }
