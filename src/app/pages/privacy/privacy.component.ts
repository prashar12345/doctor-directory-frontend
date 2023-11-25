import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  _Subscription:any;
  data:any;
  constructor(private spinner: NgxSpinnerService,
    private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getData()
  }

  getData() {
		this.spinner.show();
    let filters = {
      slug: 'privacy-policies'
    }
		this._Subscription = this.dashboardService.getAll('content', filters).subscribe((response) => {
		  if (response.success) {
			this.data = response.data;
			this.spinner.hide();
		  } else {
			this.spinner.hide();
		  }
		}, error=> {
		  this.spinner.hide();
		});
	}

  ngOnDestroy(): void {
		if (this._Subscription) {
			this._Subscription.unsubscribe();
		}
	}

}
