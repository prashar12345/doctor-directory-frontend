import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { BehaviorService } from 'src/app/shared/behavior.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  search: any;
  _Subscription: any;
  user: any;
  data = []
  insurnces = []
  specialties = []
  services = []
  _host = environment.url;
  dImg = '/assets/img/doctor.png';
  filters: {
    page: Number; status: string, search: string,
    isDeleted: boolean, address: string, count: Number, total: Number,
    category: string, insurances: string, visitType: string, specialties: string,
    services: string, userId: string
  } =
    {
      page: 1, search: '', isDeleted: false, count: 5, total: 0,
      status: 'active', category: '', address: '', insurances: '',
      visitType: '', specialties: '', services: '', userId: ''
    };


  zoom = 8;

  moreModal = false;

  // map start
  markers: any = [];
  lat: number = 51.0447;
  lng: number = -114.0719;
  icon = {
    url: "assets/img/marker.png",
    scaledSize: {
      width: 45,
      height: 45,
    },
  };

  // map End

  constructor(private _activateRouter: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private dashboardService: DashboardService, private router: Router, private _bs: BehaviorService,
    private toastr: ToastrService) {
    this.user = JSON.parse(localStorage.getItem("credentials"));
    if (this.user) {
      this.filters.userId = this.user.id;
    }

    if (this._activateRouter.snapshot.queryParamMap.get('search')) {
      this.filters.search = this._activateRouter.snapshot.queryParamMap.get('search') || '';
    }

    this._bs.specilityId.subscribe(res => {
      this.filters.specialties = res;
      this.getData()
    })

    if (this._activateRouter.snapshot.queryParamMap.get('specialties')) {
      this.filters.specialties = this._activateRouter.snapshot.queryParamMap.get('specialties') || '';
    }

    if (this._activateRouter.snapshot.queryParamMap.get('services')) {
      this.filters.services = this._activateRouter.snapshot.queryParamMap.get('services') || '';
    }
  }

  ngOnInit() {
    this.getInsurances()
    this.getSpecialties()
    this.getData()
  }

  viewDoctor(item, modal = '') {
    let visitType = item.visitType == 'Both' ? 'In-person' : item.visitType;
    let url = ''
    if (modal) {
      url = 'page/doctor-detail/' + item.id + '?appointmentType=' + visitType + '&appointment=yes';
    } else {
      url = 'page/doctordetail/' + item.id + '?appointmentType=' + visitType;
    }
    this.router.navigateByUrl(url);
  }

  favDoctor(id) {
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

  clear() {
    this.moreModal = false;
    let userid = this.user ? this.user.id : ''
    let filter: any = {
      page: 1, search: '', isDeleted: false, count: 6, total: 0,
      status: 'active', category: '', address: '', insurances: '',
      visitType: '', specialties: '', services: '', userId: userid
    }
    this.filters = filter;
    this.getData()
  }

  getData() {
    this.moreModal = false;
    this.spinner.show();
    this._Subscription = this.dashboardService.getAll('search/doctor', this.filters).subscribe((response) => {
      if (response.success) {
        this.data = response.data;
        this.filters.total = response.total;


        if (this.data.length > 0) {
          this.markers = []
          for (var i = 0; i < this.data.length; i++) {
            let starClass = [];
            let Icon = JSON.parse(JSON.stringify(this.icon));
            Icon.url = this.icon;
            this.markers.push({

              lat: Number(this.data[i].lat),
              lng: Number(this.data[i].long),
              iconUrl: Icon,
              data: this.data[i],
              class: starClass
            });

          }
          this.lat = this.markers[0].lat;
          this.lng = this.markers[0].lng;
        }

      } else {
        this.data = [];
        this.filters.total = 0;
      }

      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  searchD() {
    this.filters.page = 1;
    this.getData()
  }

  scrollTop() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }



  clearSearch() {
    this.filters.page = 1;
    this.filters.search = '';
    this.getData();
  }

  selectVisitType(p) {
    this.filters.visitType = p;
    this.getData()
  }

  pageChanged() {
    this.getData();
    this.scrollTop()
  }

  getInsurances() {
    this.spinner.show();
    let filters = {
      isDeleted: false,
      status: 'active'
    }
    this._Subscription = this.dashboardService.getAll('insurances', filters).subscribe((response) => {
      if (response.success) {
        this.insurnces = response.data;
        this.spinner.hide();
      } else {
        this.insurnces = [];
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  getSpecialties() {
    this.spinner.show();
    let filters = {
      isDeleted: false,
      status: 'active'
    }
    this._Subscription = this.dashboardService.getAll('categorys', filters).subscribe((response) => {
      if (response.success) {
        this.specialties = []
        this.services = []
        response.data.map(item => {
          if (item.type == 'Service') {
            this.services.push(item)
          } else if (item.type == 'Specialty') {
            this.specialties.push(item)
          }
        });

        this.spinner.hide();
      } else {
        this.specialties = [];
        this.services = [];
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  getfilterCounter() {
    let count = 0;
    if (this.filters.specialties != '' && this.filters.services != '') {
      count = 2;
    } else if (this.filters.specialties != '' || this.filters.services != '') {
      count = 1;
    } else if (this.filters.specialties == '' && this.filters.services == '') {
      count = 0;
    }

    return count;
  }

  public handleAddressChange(address) {
    this.filters.address = address.formatted_address
    this.getData();
  }

  htmlLength(html = '', length) {
    if (html && html.length > length) {
      return html.slice(0, length) + "..."
    }
    else {
      return html
    }
  }

  ngOnDestroy(): void {
    if (this._Subscription) {
      this._Subscription.unsubscribe();
    }
  }

}
