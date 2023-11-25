import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { setDate } from 'date-fns';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { retry } from 'rxjs/operators';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { BehaviorService } from 'src/app/shared/behavior.service';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {

  isSubmitted = false;
  start_date: any;
  addSloteForm: FormGroup;
  events = [];
  rowsOnPage = 5;
  isEdit = true;
  id: any;
  filters: { page: Number, count: Number, total: Number, userId: string, isBooked: string } = { page: 1, count: 5, total: 0, userId: '', isBooked: '' };

  appointmentDetail: any;
  description: any;

  user: any;
  individualTypes = []

  viewModal = false;
  rejectModal = false;
  addEditModal = false;

  bdpminDate = this.getIsoDate(new Date().toISOString())

  constructor(private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private dashboardService: DashboardService,
    private _bs: BehaviorService,
    private toastr: ToastrService) {
    this.user = JSON.parse(localStorage.getItem('credentials'));
    this.filters.userId = this.user.id;
  }

  ngOnInit() {
    // this.bdpminDate.setDate(this.bdpminDate.getDate());
    let visitType: any = this.user.visitType == 'Both' ? 'In-person' : this.user.visitType
    this.addSloteForm = this.formBuilder.group({
      id: [],
      title: ['', Validators.required],
      start: ['', Validators.required],
      starttime: ['00:00', Validators.required],
      scheduleType: [visitType, Validators.required]
    });
    this.getEvents();
  }

  get fTicket() { return this.addSloteForm.controls }

  addEvent() {
    this.isSubmitted = false;
    this.addEditModal = true;
    this.start_date = '';
    this.isEdit = false;
    this.addSloteForm.reset();
    let visitType: any = this.user.visitType == 'Both' ? 'In-person' : this.user.visitType
    this.addSloteForm.patchValue({ starttime: '00:00', scheduleType: visitType })
  }

  close() {
    this.addEditModal = false;
    this.viewModal = false;
    this.rejectModal = false;
    this._bs.closeModal()
  }

  status(e) {
    let event = e.target.value;
    let key: any = '';
    if (event == 'true') {
      key = true;
    } else if (event == 'false') {
      key = false;
    } else if (event == '') {
      key = '';
    }

    this.filters.page = 1;
    this.filters.isBooked = key;

    this.getEvents()
  }

  viewAppointment(id) {
    this.id = id;
    let filter = {
      appointmentId: id
    }
    this.spinner.show()
    this.dashboardService.getAll('single/book/schedule', filter).subscribe((res: any) => {
      if (res.success) {
        if (res.data) {
          this.appointmentDetail = res.data[0];
        }

        this.viewModal = true;
        this._bs.openModal()

      }
      else {
        this.events = [];
        this.filters.total = 0;
      }

      this.spinner.hide()

    }, error => {
      this.spinner.hide()
    });
  }

  public onPageChange(event) {
    this.filters.count = event.rowsOnPage;
    this.filters.page = event.activePage;
    this.getEvents();
  }

  pageChanged() {
    this.getEvents();
  }

  getEvents() {
    this.spinner.show()
    this.dashboardService.getAll('schedules', this.filters).subscribe((res: any) => {
      if (res.success) {
        this.filters.total = res.total;
        this.events = res.data;
        if (this.events.length == 0) {
          this.filters.total = 0;
        }
      }
      else {
        this.events = [];
        this.filters.total = 0;
      }

      this.spinner.hide()

    }, error => {
      this.spinner.hide()
    });
  }

  completeMark() {
    let data = {
      appointmentId: this.appointmentDetail.id
    }
    this.spinner.show()
    this.dashboardService.update(data, 'mark/complete').subscribe((res: any) => {
      if (res.success) {
        this.toastr.success(res.message, 'Success')
        this.close()
      } else {
        this.toastr.error(res.message, 'Error')
      }
      this.spinner.hide()
    }, error => {
      this.spinner.hide()
    });
  }

  onSubmitSlote() {
    this.isSubmitted = true;
    if (this.addSloteForm.invalid) {
      return;
    }

    this.getDate();
    this.close()
    this.updateSaved();
  }

  getIsoDate(date) {
    let d = new Date(date);
    let value = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    }
    return value
  }

  getDate() {
    let d = new Date();
    let date = this.addSloteForm.value.start;
    d.setFullYear(date.year);
    d.setMonth(date.month - 1);
    d.setDate(date.day);
    let time = this.addSloteForm.value.starttime;
    let hrs = time.split(":")[0];
    let mins = time.split(":")[1];
    d.setHours(hrs);
    d.setMinutes(mins);
    this.addSloteForm.patchValue({ start: d.toISOString() })
  }


  updateSaved() {
    this.spinner.show()

    if (this.isEdit) {
      this.dashboardService.update(this.addSloteForm.value, 'schedule').subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Success')
          this.getEvents();
          this.addSloteForm.reset();

        } else {
          this.toastr.error(res.message, 'Error')

        }
        this.spinner.hide()
      }, error => {
        this.spinner.hide()
      });
    } else {
      delete this.addSloteForm.value.id;
      this.dashboardService.add(this.addSloteForm.value, 'schedule').subscribe((res: any) => {
        if (res.success) {
          this.toastr.success(res.message, 'Success')
          this.close()
          this.getEvents();
          this.addSloteForm.reset();

        } else {
          this.toastr.error(res.message, 'Error')

        }
        this.spinner.hide()
      }, error => {
        this.spinner.hide()
      });
    }

  }

  changeStatus(action, id = '') {
    this.id = id ? id : this.id;
    this.description = '';
    this.isSubmitted = false;

    if (action == 'accepted') {
      this.statusChange(action)
    } else {
      this.viewModal = false;
      this.rejectModal = true;
    }
  }

  rejectSubmit() {
    this.isSubmitted = true;
    if (this.description) {
      this.statusChange('rejected')
    }
  }

  statusChange(action) {
    let data = {
      id: this.appointmentDetail.id,
      action,
      description: this.description
    }
    this.spinner.show()
    this.dashboardService.update(data, 'schedules/status').subscribe((res: any) => {
      if (res.success) {
        this.toastr.success(res.message, 'Success')
        this.close()
        this.description = '';
        this.isSubmitted = false;
        this.getEvents();
      } else {
        this.toastr.error(res.message, 'Error')
      }
      this.spinner.hide()
    }, error => {
      this.spinner.hide()
    });
  }

  remove(ID) {
    if (confirm("Do you want to delete this?")) {
      this.spinner.show();

      let obj = {
        id: ID,
        model: 'schedules'
      }

      this.dashboardService.deleteRecord(obj).subscribe((res: any) => {
        if (res.success) {
          this.toastr.success('Deleted Successfully');
          this.getEvents()
        } else {
          this.toastr.error('Unable to delete at the moment, Please try again later', 'Error');
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });
    }
  }

  editEvent(data) {
    this.isEdit = true;
    this.isSubmitted = false;
    this.addEditModal = true;
    this._bs.openModal()
    let date = this.getIsoDate(data.start);
    this.addSloteForm.patchValue({ id: data.id, title: data.title, start: date, scheduleType: data.scheduleType, starttime: data.starttime })
  }

}
