import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import roleArray from 'src/app/shared/roleArray';
import { AuthService } from '../auth.service';
import { ConfirmMatch } from 'src/app/shared/confirm-match.validator';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { environment } from 'src/environments/environment';
import { CredentialsService } from '../credentials.service';
import { BehaviorService } from 'src/app/shared/behavior.service';

@Component({
  selector: 'app-patient-signup',
  templateUrl: './patient-signup.component.html',
  styleUrls: ['./patient-signup.component.scss']
})
export class PatientSignupComponent implements OnInit {

  public Form: FormGroup;
	submitted = false;
	public rememberMe: boolean = false;
	passwordType: boolean;
	role: any="";
	fileToUpload:any;
	imageBase:any;
	_host = environment.url;
	_authSubscription:any;
	doctorId:any;
	schedule:any;
	user:any;
	data:any;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private spinner:NgxSpinnerService,
		private toastr:ToastrService,
		private authService:AuthService,
		private dashboardService: DashboardService,
		private _activateRouter: ActivatedRoute,
		private credentialsService: CredentialsService,
		private _bs: BehaviorService
	) {
		let role = localStorage.getItem("role");
		this.role = this.getRoleTable(role);
		this.user = JSON.parse(localStorage.getItem('credentials')) || '';
		this.doctorId = this.getParam('doctorId')
		this.schedule = this.getParam('schedule')
	}

	ngOnInit(): void {
		if(this.user){
			this.router.navigateByUrl('/');
		}
		this.createForm();
		if(this.doctorId){
			this.getData()
		}
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

	getParam(p){
		return this._activateRouter.snapshot.queryParamMap.get(p) || ''
	}

	markRemember() {
		this.rememberMe = !this.rememberMe;
	}

	createForm() {
	this.Form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      role:['patients'],
      gender:['',Validators.required],
      agree:[false],
	  image:[''],
      password:['', [Validators.required, Validators.minLength(9)]],
      confirmPassword:['', [Validators.required, Validators.minLength(9)]],
      mobileNo: ['', [Validators.required, Validators.min(1000000000)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%. +-]+@[a-z0-9.-]+\\.[a-z]{2,4}.$")]]
    },
	{
	  validator: ConfirmMatch('password', 'confirmPassword')
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

	get f() {
		return this.Form.controls;
	}

	togglePassword() {
		this.passwordType = !this.passwordType;
	}

	onSubmit() {
		this.submitted = true;
    	let isagree = this.Form.value.agree;
		if (!this.Form.invalid && isagree) {
		this.spinner.show();
		this._authSubscription = this.authService.Signup(this.Form.value).subscribe(res => {
			if (res.success) {
			this.Form.reset();
			this.submitted = false;
			if(this.doctorId){
				this.user = res.data;
				let BookForm = {
					patientId: this.user.id,
					insurence: this.getParam('insurence'),
					visitType: this.getParam('visitType'),
					doctorBefore: this.getParam('doctorBefore'),
					schedulesId: this.getParam('schedulesId'),
					appointmentType: this.getParam('appointmentType'),
					doctorId: this.getParam('doctorId'),
					schedule: this.getParam('schedule')
				}
				let url = '/page/booking';
				this.router.navigate([url],{ queryParams: BookForm});
				this.credentialsService.setCredentials(res.data);
				this._bs.setUserData(this.user);
			}else{
				this.toastr.success("Successfully signup.");
				this.router.navigate(['/auth/login/patient']);
			}
			
			} else {
			this.toastr.error(res.error.message);
			}
			this.spinner.hide();
		},
			error => {
			this.spinner.hide();
			// this.toastr.error(error);
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
