import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {

  _authSubscription:any;
  data:any;
  id:any;

  _host = environment.url;
  dImg = '/assets/img/no-image.jpg';

  constructor(private spinner: NgxSpinnerService, private dashboardService:DashboardService,
    private _activateRouter: ActivatedRoute ) {
      this.id = this._activateRouter.snapshot.params['id'];
      this.getData();
    }

  ngOnInit() {
  }

  getData() {
		this.spinner.show();
    let filters = {
      id: this.id
    }
		this._authSubscription = this.dashboardService.getAll('blog', filters).subscribe((response) => {
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

  getURL(img){
    return img?this._host+img:this.dImg
  }

  ngOnDestroy(): void {
		if (this._authSubscription) {
			this._authSubscription.unsubscribe();
		}
	}

}
