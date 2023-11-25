import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import roleArray from 'src/app/shared/roleArray';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { environment } from 'src/environments/environment';
import { BehaviorService } from 'src/app/shared/behavior.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  public patientForm: FormGroup;
  public BookForm: FormGroup;
	submitted = false;
	public rememberMe: boolean = false;
	passwordType: boolean;
	fileToUpload:any;
	imageBase:any;
	_host = environment.url;
	_authSubscription:any;
	schedule:any;

	doctorId:any;
	data:any;
	patients = []
	visits = []

	user:any;

	signup = false;
	someoneModal = false;

	maxdate = new Date();
	mindate = new Date();
	birthmaxDate:any = new Date()
  	birthminDate:any = new Date()
	bdpminDate = this.getIsoDate(new Date().toISOString())

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private spinner:NgxSpinnerService,
		private toastr:ToastrService,
		private dashboardService: DashboardService,
		private _activateRouter:ActivatedRoute,
		private _bs: BehaviorService
	) {
		this.user = JSON.parse(localStorage.getItem('user')) || '';
		this.doctorId = this.getParam('doctorId')
		this.schedule = this.getParam('schedule')
	}

	addSomeOne(){
		this.someoneModal = true;
		this.patientForm.reset()
		this._bs.openModal()
	}
	

	ngOnInit(): void {
		this.birthmaxDate = this.getIsoDate(this.maxdate.setDate(this.maxdate.getDate() - 5840))
		this.birthminDate = this.getIsoDate(this.mindate.setDate(this.mindate.getDate() - 36500))

		this.getPatients()
		this.getData()
		this.getVisit()
		this.createForm()
	}

	getIsoDate(date){
		let d = new Date(date);
		let value ={
		  year: d.getFullYear(),
		  month:d.getMonth()+1,
		  day:d.getDate()
		}
		return value
	}

	getDate(){
		let d = new Date();
		let date = this.patientForm.value.dob;
		d.setFullYear(date.year);
		d.setMonth(date.month-1);
		d.setDate(date.day);
		this.patientForm.patchValue({dob:d.toISOString()})
	}

	getData() {
		this.spinner.show();
		let filters = {
		id: this.doctorId,
		role:'doctors'
		}
		this._authSubscription = this.dashboardService.getAll('user/details', filters).subscribe((response) => {
		  if (response.success) {
			this.data = response.data;
		  }

      	this.spinner.hide();
		}, error=> {
		  this.spinner.hide();
		});
  	}

	getPatients() {
		this.spinner.show();
		let filters = {
		id: this.user.id
		}
		this._authSubscription = this.dashboardService.getAll('patient/relatives', filters).subscribe((response) => {
		  if (response.success) {
			this.patients = response.data;
		  }

      	this.spinner.hide();
		}, error=> {
		  this.spinner.hide();
		});
  	}

	getParam(p){
		return this._activateRouter.snapshot.queryParamMap.get(p) || ''
	}

	getVisit() {
	this.spinner.show();
	let filters = {
		isDeleted:false,
		status:'active'
	}
	this._authSubscription = this.dashboardService.getAll('visits', filters).subscribe((response) => {
		if (response.success) {
		this.visits = response.data;
		this.spinner.hide();
		} else {
		this.visits = [];
		this.spinner.hide();
		}
	}, error=> {
		this.spinner.hide();
	});
	}

	markRemember() {
		this.rememberMe = !this.rememberMe;
	}

	createForm() {
	this.patientForm = this.formBuilder.group({
		firstName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
		lastName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
		gender:['',Validators.required],
		dob:['',Validators.required],
		legalGuardian:['',Validators.required],
		email: ['', [Validators.email, Validators.pattern("^[a-z0-9._%. +-]+@[a-z0-9.-]+\\.[a-z]{2,4}.$")]]
	  });

	this.BookForm = this.formBuilder.group({
		patientType: ['self', [Validators.required]],
		patientId:[this.user.id, Validators.required],
		insurence: [this.getParam('insurence'), [Validators.required]],
		visitType: [this.getParam('visitType'), [Validators.required]],
		doctorBefore: [this.getParam('doctorBefore'), [Validators.required]],
		schedulesId: [this.getParam('schedulesId'), [Validators.required]],
		appointmentType: [this.getParam('appointmentType'), [Validators.required]],
		agree:[false],
		description:[''],
		mobileNo: ['', [Validators.required, Validators.min(1000000000)]]
	  });
	}

	route(url){
		this.router.navigateByUrl(url)
	}

	login(){
		let role = localStorage.getItem("role");
		let url = '/auth/login/'+role;
		this.route(url);
	}

	changeType(p){
		this.BookForm.patchValue({patientType:p})
	}

	get b() {
		return this.BookForm.controls;
	}

	get p() {
		return this.patientForm.controls;
	}

	togglePassword() {
		this.passwordType = !this.passwordType;
	}

	patientSubmit() {
		this.submitted = true;
		if (!this.patientForm.invalid) {
		this.spinner.show();
		this.getDate()
		this._authSubscription = this.dashboardService.add(this.patientForm.value,'patient/relative').subscribe(res => {
			if (res.success) {
			this.patientForm.reset();
			this.submitted = false;
			this.toastr.success(res.message);
			this.close()
			this.getPatients();

			} else {
			this.toastr.error(res.error.message);
			}
			this.spinner.hide();
		},
			error => {
			this.spinner.hide();
			}
		);

		}
	}

	close(){
		this.someoneModal = false;
		this._bs.closeModal();
	}

	onBookSubmit() {
		this.submitted = true;
    	let isagree = this.BookForm.value.agree;
		if (!this.BookForm.invalid && isagree) {
		this.spinner.show();
		this._authSubscription = this.dashboardService.add(this.BookForm.value,'book/schedule').subscribe(res => {
			if (res.success) {
			this.BookForm.reset();
			this.submitted = false;
			this.toastr.success(res.message);
			this.router.navigateByUrl('/')

			} else {
			this.toastr.error(res.error.message);
			}
			this.spinner.hide();
		},
			error => {
			this.spinner.hide();
			}
		);

		}
	}

	getRoleTable(role){
		let value = ''
		roleArray.map(item=>{
			if(item.label == role){
				value = item.list
			}
		})
		
		return value
	}
  
	ngOnDestroy(): void {
		if (this._authSubscription) {
			this._authSubscription.unsubscribe();
		}
	}

}
