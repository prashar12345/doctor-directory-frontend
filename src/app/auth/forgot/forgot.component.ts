import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import roleArray from 'src/app/shared/roleArray';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  public Form: FormGroup;
	submitted = false;
	public rememberMe: boolean = false;
	passwordType: boolean;
	role: any="";

	_authSubscription:any;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private spinner:NgxSpinnerService,
		private toastr:ToastrService,
		private authService:AuthService
	) {
		let role = localStorage.getItem("role");
		this.role = this.getRoleTable(role);
	}

	ngOnInit(): void {
		this.createForm();
	}

	markRemember() {
		this.rememberMe = !this.rememberMe;
	}

	createForm() {
		this.Form = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%. +-]+@[a-z0-9.-]+\\.[a-z]{2,4}.$")]],
			role: [this.role]
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
		if (!this.Form.invalid) {
		this.spinner.show();
		this._authSubscription = this.authService.sendEmail(this.Form.value).subscribe(res => {
			if (res.success) {
			this.Form.reset();
			this.submitted = false;
			this.toastr.success('Code sent successfully to your email!');
			this.router.navigate(['/auth/reset']);
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

	back(){
		let url = ''
		if(this.role == 'doctors'){
			url = '/auth/login/doctor'
		}else{
			url = '/auth/login/patient'
		}
		this.router.navigateByUrl(url)
	}

  
	ngOnDestroy(): void {
		if (this._authSubscription) {
			this._authSubscription.unsubscribe();
		}
	}

}
