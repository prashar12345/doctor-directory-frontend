import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { BlogComponent } from './blog/blog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TermsComponent } from './terms/terms.component';
import { ContactComponent } from './contact/contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './search/search.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AgmCoreModule } from '@agm/core';
import { DoctorDetailsComponent } from './doctor-details/doctor-details.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { BookingComponent } from './booking/booking.component';
import { DoctorDetailComponent } from './doctor-detail/doctor-detail.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ScrollSpyDirective } from '../scroll-spy.directive';

@NgModule({
  declarations: [BlogComponent, ScrollSpyDirective, BlogDetailComponent, AboutComponent, PrivacyComponent, TermsComponent, ContactComponent, SearchComponent, DoctorDetailsComponent, BookingComponent, DoctorDetailComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NgxPaginationModule,
    FormsModule, ReactiveFormsModule,
    GooglePlaceModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCbRhC6h9Pp43-5t_Knyrd_ewAdLMIJtCg',
      libraries: ['places']
    }),
    NgbModule
  ]
})
export class PagesModule { }
