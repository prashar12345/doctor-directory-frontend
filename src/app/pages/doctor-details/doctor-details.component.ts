import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarView,
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { BehaviorService } from 'src/app/shared/behavior.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.scss']
})
export class DoctorDetailsComponent implements OnInit {

  _Subscription: any;
  _host = environment.url;
  data: any;
  reviews = []
  blogs = []
  doctors = []
  id: any;
  dImg = '/assets/img/doctor.png';
  dBlog = '/assets/img/aboutbg.jpg';
  filters: { page: Number; status: string, search: string, isDeleted: boolean, count: Number, total: Number, doctorId: string } = { page: 1, search: '', isDeleted: false, count: 6, total: 0, status: 'active', doctorId: '' };
  user: any;
  review_avrage: any;

  // map
  markers = []
  lat: number = 51.0447;
  lng: number = -114.0719;
  icon = {
    url: "assets/img/marker.png",
    scaledSize: {
      width: 45,
      height: 45,
    },
    // origin: new google.maps.Point(0, 0), // origin
    // anchor: new google.maps.Point(0, 0),
  };
  zoom = 8

  // map end


  appointmentModal = false;
  insurnces = []
  visits = []
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = true;
  eventsCalendar: CalendarEvent[] = [];
  modalData: any;
  allSlots = [];
  viewMdal = false;
  refresh: Subject<any> = new Subject();
  public Form: FormGroup;
  closeResult = '';
  submitted = false;
  isparamModal: any;

  constructor(private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private dashboardService: DashboardService,
    private _activateRouter: ActivatedRoute,
    private router: Router,
    private _bs: BehaviorService,
    private toastr: ToastrService) {
    this.id = this._activateRouter.snapshot.params['id'];
    this.filters.doctorId = this.id;
    this.user = JSON.parse(localStorage.getItem('credentials')) || '';
    this.isparamModal = this._activateRouter.snapshot.queryParamMap.get('appointment') || '';
  }

  ngOnInit() {
    this.getData()
    this.getVisit()
    this.createForm()
    this.getReview()
    this.getBlogs()

    if (this.isparamModal) {
      this.appointmentModal = true;
      this._bs.openModal()
    }
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

  get f() {
    return this.Form.controls;
  }

  getParam(p) {
    return this._activateRouter.snapshot.queryParamMap.get(p) || ''
  }

  createForm() {
    this.Form = this.formBuilder.group({
      insurence: ["", [Validators.required]],
      visitType: ["", [Validators.required]],
      doctorBefore: ["", [Validators.required]],
      appointmentType: [this.getParam('appointmentType'), [Validators.required]],
      schedulesId: ["", [Validators.required]],
      schedule: [""],
      doctorId: [this.id]
    });
  }

  scrollTo(section) {
    document.querySelector('#' + section)
      .scrollIntoView();
  }

  close() {
    if (this.isparamModal) {
      this.router.navigateByUrl('/page/search')
    }
    this._bs.closeModal()
    this.appointmentModal = false;
  }

  openModal() {
    this.appointmentModal = true;
    this._bs.openModal()
  }

  scheduleChange(e) {
    console.log("event", e.target.value)
    this.getEvents(e.target.value)
  }


  getData() {
    this.spinner.show();
    let filters = {
      id: this.id,
      role: 'doctors',
      userId: this.user ? this.user.id : ''
    }
    this._Subscription = this.dashboardService.getAll('user/details', filters).subscribe((response) => {
      if (response.success) {
        this.data = response.data;
        this.review_avrage = parseInt(this.data.review_avrage)
        let starClass = [];
        this.markers.push({
          lat: Number(this.data.lat),
          lng: Number(this.data.long),
          iconUrl: this.icon,
          data: this.data,
          class: starClass
        });

        this.lat = this.markers[0].lat;
        this.lng = this.markers[0].lng;

        this.getDoctors()
        let appointmentType = this.data.visitType == 'Both' ? 'In-person' : this.data.visitType;
        this.Form.patchValue({ appointmentType })
        this.getEvents(this.data.visitType == 'Both' ? 'In-person' : this.data.visitType);
      }

      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getInt(value) {
    return parseInt(value)
  }

  getReview() {
    this.spinner.show();
    this._Subscription = this.dashboardService.getAll('reviews', this.filters).subscribe((response) => {
      if (response.success) {
        this.reviews = response.data;
        this.filters.total = response.total;
      } else {
        this.filters.total = 0
        this.reviews = []
      }

      this.spinner.hide();
    }, error => {
      this.reviews = []
      this.filters.total = 0;
      this.spinner.hide();
    });

    this.getEvents();
  }

  getBlogs() {
    this.spinner.show();
    let filters = {
      count: 3,
      isDeleted: false,
      status: 'active'
    }
    this._Subscription = this.dashboardService.getAll('blogs', filters).subscribe((response) => {
      if (response.success) {
        this.blogs = response.data;
      }

      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    });
  }

  getDoctors() {
    this.spinner.show();
    let filters = {
      count: 4,
      speciaties: this.data && this.data.specialties[0].id || '',
      services: this.data && this.data.services[0].id || '',
      notDoctorId: this.id,
      userId: this.user ? this.user.id : ''
    }
    this._Subscription = this.dashboardService.getAll('search/doctor', filters).subscribe((response) => {
      if (response.success) {
        this.doctors = response.data;
      }

      this.spinner.hide();
    }, error => {
      this.doctors = []
      this.spinner.hide();
    });
  }

  veiwRelated(id) {
    let url = "/page/doctor-detail/" + id;
    this.router.navigateByUrl(url);
    this.id = id;
    this.filters.doctorId = id;
    this.ngOnInit()
  }

  getSlote(s) {
    this.Form.patchValue({ schedule: this.getDateLocal(s.start) })
  }

  getDateLocal(date) {
    return new Date(date).toISOString()
  }

  onSubmit() {
    this.submitted = true;
    // console.log("fdghdfg",this.Form.value)
    if (!this.Form.invalid) {

      let url = '';
      if (this.user) {
        url = '/page/booking'
      } else {
        url = '/auth/patient-signup'
      }

      this._bs.closeModal();
      this.router.navigate([url], { queryParams: this.Form.value });
    }
  }

  viewRelatedDoctor() {
    let url = '/page/search';

    let specialties: any = this.data.specialties[0].id
    let services: any = this.data.services[0].id

    let params = {
      specialties,
      services
    }
    this.router.navigate([url], { queryParams: params });
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log("dsff", date)
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }

      this.Form.patchValue({ schedulesId: '' });
      this.viewDate = date;
      this.allSlots = events;
      console.log("this.allSlots", this.allSlots)
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.viewMdal = true;
  }

  getEvents(scheduleType = 'In-person') {
    let filters = {
      userId: this.id,
      scheduleType: scheduleType,
      isBooked: false
    }
    this.spinner.show()
    this.dashboardService.getAll('schedules', filters).subscribe((res: any) => {
      if (res.success) {
        this.eventsCalendar = res.data.map((element) => {
          let status = element.status
          // element.start = element.start
          // element.end = element.end
          if (element['bookedBy']) {
            if (element['status']) {

            } else {

              status = 'pending';
            }

          }

          return {
            id: element.id,
            start: new Date(element.start),
            isBooked: element.isBooked,
            isDeleted: element.isDeleted,
            scheduleType: element.scheduleType,
            // actions: actions,
            status: status,
            title: element.title
          }

        });

        if (this.eventsCalendar.length > 0) {
          this.viewDate = this.eventsCalendar[0].start;
        }

        // this.loadData()
      }

      this.spinner.hide()

    }, error => {
      this.spinner.hide();
    });
  }

  getVisit() {
    this.spinner.show();
    let filters = {
      isDeleted: false,
      status: 'active'
    }
    this._Subscription = this.dashboardService.getAll('visits', filters).subscribe((response) => {
      if (response.success) {
        this.visits = response.data;
        this.spinner.hide();
      } else {
        this.visits = [];
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  ngOnDestroy(): void {
    if (this._Subscription) {
      this._Subscription.unsubscribe();
    }
  }

}
