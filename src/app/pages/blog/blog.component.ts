import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  _authSubscription:any;
  blogs = []
  _host = environment.url;
  dImg = '/assets/img/no-image.jpg';
  categories = [];

  filters: { page: Number;status:string, search: string , isDeleted:boolean, count : Number, total:Number, categoryId: string} = { page: 1, search: '', isDeleted:false, count:6, total:0, status: 'active', categoryId: ''};

  constructor(private router: Router,
		private spinner:NgxSpinnerService,
		private toastr:ToastrService,
		private dashboardService: DashboardService) { }

  ngOnInit() {
    this.getCategories();
    this.getData();
  }

getData() {
		this.spinner.show();
		this._authSubscription = this.dashboardService.getAll('blogs', this.filters).subscribe((response) => {
		  if (response.data && response.data.length > 0) {
			this.blogs = response.data;
			this.filters.total = response.total;
			this.spinner.hide();
		  } else {
			this.blogs = [];
			this.filters.total = 0;
			this.spinner.hide();
		  }
		}, error=> {
		  this.spinner.hide();
		});
}

getCategories() {
    this.spinner.show();
    let filter = {
      status: 'active',
      isDeleted: false
    }
    this._authSubscription = this.dashboardService.getAll('categorys', filter).subscribe((response) => {
      if (response.success) {
        this.categories = []
        response.data.map((item, i)=>{
          if(item.type == 'News'){
            this.categories.push(item)
          }
        
        });
        this.spinner.hide();

      } else {
        this.categories = []
        this.spinner.hide();
      }
    }, error=> {
      this.spinner.hide();
    });
  }

pageChanged(){
	this.getData();
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
