import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bs } from 'date-fns/locale';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BehaviorService } from 'src/app/shared/behavior.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-my-appointment',
  templateUrl: './my-appointment.component.html',
  styleUrls: ['./my-appointment.component.scss']
})
export class MyAppointmentComponent implements OnInit {

  data = [];
  viewData: any;
  reviewData: any;
  public reviewForm: FormGroup;
  _Observable: any;
  submitted = false;
  reviewModal = false;
  viewModal = false;
  viewReviewModal = false;
  rating: any;
  filters: { page: Number, count: Number, total: Number, userId: string, status: string } = { page: 1, count: 5, total: 0, userId: '', status: '' };
  constructor(private dashboardService: DashboardService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private _bs: BehaviorService) {
  }

  fiveStars = [5, 4, 3, 2, 1]

  ngOnInit() {
    this.getData()
    this.createForm()
  }

  filter() {
    this.filters.page = 1;
    this.getData()
  }

  createForm() {
    this.reviewForm = this.formBuilder.group({
      bookschedulesId: [''],
      doctorId: [''],
      // rating: ['', [Validators.required]],
      waitTime: ['', [Validators.required]],
      knowledge: ['', [Validators.required]],
      manner: ['', [Validators.required]],
      review: ['', [Validators.required]],
    });
  }

  get f() { return this.reviewForm.controls; }

  getData() {
    this.spinner.show()
    this.dashboardService.getAll('book/schedules', this.filters).subscribe((res: any) => {
      if (res.success) {
        this.filters.total = res.total;
        this.data = res.data;

        if (this.data.length == 0) {
          this.filters.total = 0;
        }
      }
      else {
        this.data = [];
        this.filters.total = 0;
      }

      this.spinner.hide()

    }, error => {
      this.spinner.hide()
    });
  }

  view(item) {
    this.viewModal = true;
    this.viewData = item;
    this._bs.openModal()
  }

  close() {
    this.viewModal = false;
    this.reviewModal = false;
    this.viewReviewModal = false;
    this._bs.closeModal();
  }

  addReview(item: any) {
    this.close()
    this.reviewModal = true;
    this._bs.openModal()
    this.submitted = false;
    this.reviewForm.reset()
    this.reviewForm.patchValue({ bookschedulesId: item.id, doctorId: item.doctorId })
  }

  viewReview(item) {
    this.viewModal = false;

    let filter = {
      bookschedulesId: item.id
    }

    this.spinner.show()
    this.dashboardService.getAll('view/review', filter).subscribe((res: any) => {
      if (res.success) {
        this.reviewData = res.data;
        this.viewReviewModal = true;
        this._bs.openModal()
      }

      this.spinner.hide()

    }, error => {
      this.spinner.hide()
    });
  }

  onSubmit() {
    this.submitted = true;

    // console.log(this.reviewForm.value)
    // return
    if (!this.reviewForm.invalid) {
      this.spinner.show();
      this._Observable = this.dashboardService.add(this.reviewForm.value, `review`).subscribe(res => {

        if (res.success) {
          this.toastr.success(res.message);
          this.reviewModal = false;
          this.getData();
          this.reviewForm.reset()
        } else {
          this.toastr.error(res.message, 'Error');
        }
        this.spinner.hide();
      },
        error => {
          this.spinner.hide();
        });
    }
  }

  ngOnDestroy(): void {
    if (this._Observable) {
      this._Observable.unsubscribe();
    }
  }

}
