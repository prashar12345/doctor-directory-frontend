import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { NavigationStart, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CredentialsService } from 'src/app/auth/credentials.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  doctors = []
  _host = environment.url;
  specialties = []
  dSpecialty = './assets/img/doctor.png';
  _Subscription:any;
  dImg = './assets/img/doctor.png';
  user:any;
  searchText:any;

  constructor(private spinner: NgxSpinnerService, private router: Router,
    private dashboardService: DashboardService,
    private credentialService: CredentialsService) {

      this.user = JSON.parse(localStorage.getItem('credentials')) || '';
     }

  ngOnInit() {
    this.getSpecialties()
    this.getDoctors()
  }

  getSpecialties() {
		this.spinner.show();
    let filters ={
      status:'active',
      isDeleted: false,
      count:50
    }
		this._Subscription = this.dashboardService.getAll('categorys', filters).subscribe((response) => {
		  if (response.data && response.data.length > 0) {
			this.specialties = [] 
      response.data.map(item=>{
        if(item.type == 'Specialty'){
          this.specialties.push(item);
        }
      });

			this.spinner.hide();
		  } else {
			this.specialties = [];
			this.spinner.hide();
		  }
		}, error=> {
		  this.spinner.hide();
		});
  }

  getInt(value){
    return parseInt(value)
  }

  getDoctors() {
		this.spinner.show();
    let filters ={
      status:'active',
      isFeatured:true,
      count:4,
      userId: this.user?this.user.id:''
    }
		this._Subscription = this.dashboardService.getAll('search/doctor', filters).subscribe((response) => {
		  if (response.success) {
			this.doctors = response.data
			this.spinner.hide();
		  } else {
			this.doctors = [];
			this.spinner.hide();
		  }
		}, error=> {
		  this.spinner.hide();
		});
  }

  viewDoctor(id){
    let url = 'page/doctor-detail/'+id;
    this.router.navigateByUrl(url);
  }

  viewSpacialty(id){
    let url = 'page/search?specialties='+id;
    this.router.navigateByUrl(url);
  }

  search(){
    this.searchText = this.searchText?this.searchText:'';
    this.router.navigateByUrl('/page/search?search='+this.searchText)
  }

ngOnDestroy(): void {
  if (this._Subscription) {
    this._Subscription.unsubscribe();
  }
}

}
