import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

// import { AuthModule } from '../auth/auth.module';
// import { DashboardModule } from '../dashboard/dashboard.module';
// import { HomeModule } from '../home/home.module';
// import { AppointmentModule } from '../appointment/appointment.module';
// import { PagesModule } from '../pages/pages.module';

import { AuthGuard } from '../shared/auth.guard';


import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';


const routes: Routes = [
  	{
		path: '',
		redirectTo: 'home',
		pathMatch: 'full',
	},
	{
		path: 'auth',
		// loadChildren: () => AuthModule,
		loadChildren: '../auth/auth.module#AuthModule'

	},{
    path:'',
    component: LayoutComponent,
	// canActivate: [AuthGuard],
    children :[
		{
			path: '',
			// loadChildren: () => HomeModule,
			loadChildren: '../home/home.module#HomeModule'
		},
		{
			path: 'page',
			// loadChildren: () => PagesModule,
			loadChildren: '../pages/pages.module#PagesModule'
		},
    ]
  },{
    path:'',
    component: DashboardLayoutComponent,
	canActivate: [AuthGuard],
    children :[
      	{
		path: 'dashboard',
		// loadChildren: () => DashboardModule,
		loadChildren: '../dashboard/dashboard.module#DashboardModule'
		},
		{
			path: 'appointment',
			// loadChildren: () => AppointmentModule,
			loadChildren: '../appointment/appointment.module#AppointmentModule'
		}
    ]
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
export class ThemeRoutingModule { }
