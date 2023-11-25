import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { BehaviorService } from 'src/app/shared/behavior.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  _Subscription:any;
  specialties = []
  activeSpecialty:any;
  // activeSpecialty:any;
  constructor(private spinner: NgxSpinnerService,
    private dashboardService: DashboardService,private _bs:BehaviorService,
    private _activateRouter:ActivatedRoute) {
      this.activeSpecialty = this._activateRouter.snapshot.queryParamMap.get('specialties') || '';
    }

  ngOnInit() {
    this.getSpecialties()
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
      response.data.map((item, i)=>{
        if(this.specialties.length<10){
          if(item.type == 'Specialty'){
            this.specialties.push(item);
          }
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

  viewSpacialty(id){
    if(this.activeSpecialty == id){
      return
    }
    this.activeSpecialty = id;
    this._bs.specilityId.next(id)
  }

  ngOnDestroy(): void {
    if (this._Subscription) {
      this._Subscription.unsubscribe();
    }
  }
}
