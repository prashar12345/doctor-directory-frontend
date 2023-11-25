import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { CredentialsService } from '../credentials.service';
import { ConfirmMatch } from 'src/app/shared/confirm-match.validator';
import roleArray from 'src/app/shared/roleArray';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  public Form: FormGroup;
	submitted = false;
	public rememberMe: boolean = false;
	_loginObservable: any;
	passwordType: boolean;
	passwordType2:boolean;
	passwordType3:boolean;
	role: any="";
	id:any;
	user:any;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private spinner: NgxSpinnerService,
		private toastr:ToastrService,
		private credentialsService: CredentialsService

	) {
		let role = localStorage.getItem("role");
		this.role = this.getRoleTable(role);
		this.user = JSON.parse(localStorage.getItem("credentials"));
		this.id = this.user.id;
		
	}

	ngOnInit(): void {
		this.createForm();
	}

	markRemember() {
		this.rememberMe = !this.rememberMe;
	}

	createForm() {
		this.Form = this.formBuilder.group({
			currentPassword: ["", [Validators.required, Validators.minLength(9)]],
			newPassword: ["", [Validators.required, Validators.minLength(9)]],
			confirmPassword:["", [Validators.required, Validators.minLength(9)]],
			role:[this.role],
			id:[this.id],
		},
		{
		  validator: ConfirmMatch('newPassword', 'confirmPassword')
		});
	}

	back(){
		let url = ''

		if(this.user.role == 'doctor'){
			url = '/dashboard'
		}else{
			url = '/dashboard/profile'
		}

		this.router.navigateByUrl(url)
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
		  this._loginObservable = this.authService.changePass(this.Form.value).subscribe(res => {
			  if (res.success) {
			  this.toastr.success(res.message);
			  this.logout();
			} else {
			  this.toastr.error(res.error.message, 'Error');
			}
			this.spinner.hide();
		  },
			error => {
			  this.spinner.hide();
			  // this.toastr.error(error, 'Error');
			}
		  )
		}
	}

	logout() {
		this.credentialsService.logout().subscribe(res => {
		  this.router.navigate(['/']);
		});
	  }

  
	ngOnDestroy(): void {
		if (this._loginObservable) {
			this._loginObservable.unsubscribe();
		}
	}

}
