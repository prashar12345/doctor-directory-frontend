import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard.service';
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  
  _host = environment.url;
  filters: { page: Number, count : Number,total:Number, status:string} = { page: 1, count:6, total:0, status:''}; 
  data = []
  dImg = '/assets/img/doctor.png';

  constructor(private router:Router, private spinner:NgxSpinnerService,
    private dashboardService: DashboardService,
    private toastr: ToastrService) { }
  

  ngOnInit() {
    this.getData()
  }

  viewDoctor(id){
    let url = 'page/doctor-detail/'+id;
    this.router.navigateByUrl(url);
  }

  getData() {
    this.spinner.show()
    this.dashboardService.getAll('favourites', this.filters).subscribe((res: any) => {
      if (res.success) {
        this.filters.total = res.total;
        this.data = res.data;
        if(this.data.length==0){
          this.filters.total = 0;
        }
      }
      else{
        this.data = [];
        this.filters.total = 0;
      }

      this.spinner.hide()
        
    },error=>{
      this.spinner.hide()
    });
  }

  favDoctor(id){
    let data = {
      doctorId: id
    }
    this.spinner.show()
    this.dashboardService.add(data, 'favourite').subscribe((res: any) => {
      if (res.success) {
        // this.toastr.success(res.message, 'Success')
        this.getData()
      } else {
        this.toastr.error(res.message, 'Error')
  
      }
      this.spinner.hide()
    }, error => {
      this.spinner.hide()
    });
  }

  getInt(value){
    return parseInt(value)
  }

}
