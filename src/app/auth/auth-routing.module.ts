import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SignupComponent } from './signup/signup.component';
import { PatientSignupComponent } from './patient-signup/patient-signup.component';
import { DoctorSignupComponent } from './doctor-signup/doctor-signup.component';

const routes: Routes = [
  {
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: 'login',
		component:LoginComponent
	},
	{
		path: 'login/:role',
		component:LoginComponent
	},
	{
		path: 'signup',
		component:SignupComponent
	},
	{
		path: 'patient-signup',
		component:PatientSignupComponent
	},
	{
		path: 'doctor-signup',
		component: DoctorSignupComponent
	},
	{
		path: 'forgot',
		component:ForgotComponent
	},
	{
		path: 'reset',
		component:ResetComponent
	},
	{
		path: 'change-password',
		component:ChangePasswordComponent
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
export class AuthRoutingModule { }
