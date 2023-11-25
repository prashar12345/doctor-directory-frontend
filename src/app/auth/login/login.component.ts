import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import {NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import roleArray from 'src/app/shared/roleArray';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public adminLoginForm: FormGroup;
	submitted = false;
	public rememberMe: boolean = false;
	_loginObservable: any;
	passwordType: boolean;
	role: any="";
	roleName:any;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private spinner: NgxSpinnerService,
		private authService:AuthService,
		private toastr: ToastrService,
		private _activateRouter: ActivatedRoute,
	) {
		this.roleName =this._activateRouter.snapshot.params['role'] || 'user';
		this.role = this.getRoleTable(this._activateRouter.snapshot.params['role'] || 'user');
	}

	ngOnInit(): void {
		this.createForm();
		let user = localStorage.getItem('credentials')
		if(user){
		this.router.navigate(['/']);
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

	markRemember() {
		this.rememberMe = !this.rememberMe;
	}

	createForm() {
		this.adminLoginForm = this.formBuilder.group({
			email: ["", [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%. +-]+@[a-z0-9.-]+\\.[a-z]{2,4}.$")]],
			password: ["", Validators.required],
			role:[this.role],
			remember: [""],
		});
	}

	get f() {
		return this.adminLoginForm.controls;
	}

	togglePassword() {
		this.passwordType = !this.passwordType;
	}

	route(url){
		this.router.navigateByUrl(url)
	  }

	forgot(){
		let url = '/auth/forgot';
		localStorage.setItem("role", this.roleName)
		this.route(url);
	}

	signup(){
		let url = '';
		if(this.roleName == 'patient'){
			url = '/auth/patient-signup';
		} else if(this.roleName == 'doctor'){
			url = '/auth/doctor-signup'
		}
		this.route(url);
	}
	

	onSubmit() {
		let email:any = this.adminLoginForm.value.email;
		let e = email.replace(/\s+/g, '').trim();
		this.adminLoginForm.patchValue({email: e.toLowerCase()})
		this.submitted = true;

		if (!this.adminLoginForm.invalid) {
			

			this.spinner.show();
			this._loginObservable = this.authService.login(this.adminLoginForm.value).subscribe(res => {
			  if (res.success) {

				if(this.roleName == 'doctor'){
					this.router.navigate(['/dashboard/dashboard']);
				}else if(this.roleName == 'patient'){
					this.router.navigate(['/dashboard/profile']);
				}
				
				this.toastr.success('Logged In Successfully!');
			  } else {
				this.toastr.error(res.error.message, 'Error');
			  }
	  
			  if (this.rememberMe == true) {
				let rememberData = {
				  email:this.adminLoginForm.controls.email.value,
				  password:this.adminLoginForm.controls.password.value,
				}
			
				localStorage.setItem("remember", JSON.stringify(rememberData));
	   
			  } else {
				localStorage.removeItem('remember'); 
			  }
	  
			  this.spinner.hide();
			},
			  error => {
				this.spinner.hide();
				// this.toastr.error(error, 'Error');
			  }
			);
		  }
	}

  
	ngOnDestroy(): void {
		if (this._loginObservable) {
			this._loginObservable.unsubscribe();
		}
	}

}
