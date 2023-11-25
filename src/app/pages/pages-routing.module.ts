import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './blog/blog.component';
import { Routes, RouterModule } from '@angular/router';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { SearchComponent } from './search/search.component';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { BookingComponent } from './booking/booking.component';
import { DoctorDetailComponent } from './doctor-detail/doctor-detail.component';
const routes: Routes = [
 
	{
		path: 'news',
		component:BlogComponent
	},
	{
		path: 'about',
		component:AboutComponent
	},
	{
		path: 'contact',
		component:ContactComponent
	},
	{
		path: 'privacy',
		component:PrivacyComponent
	},
	{
		path: 'terms',
		component:TermsComponent
	},
	{
		path: 'news-detail/:id',
		component:BlogDetailComponent
	},
	{
		path: 'search',
		component:SearchComponent
	},
	{
		path: 'doctor-detail/:id',
		component:DoctorDetailsComponent
	},
	{
		path: 'doctordetail/:id',
		component:DoctorDetailComponent
	},
	{
		path: 'booking',
		component: BookingComponent
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
export class PagesRoutingModule { }
