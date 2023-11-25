import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import roleArray from 'src/app/shared/roleArray';
import { AuthService } from '../auth.service';
import { ConfirmMatch } from 'src/app/shared/confirm-match.validator';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {

  public Form: FormGroup;
	submitted = false;
	public rememberMe: boolean = false;
	_loginObservable: any;
	passwordType: boolean;
	passwordType2:boolean;
	role: any="";

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private spinner:NgxSpinnerService,
		private authService:AuthService,
		private toastr:ToastrService

	) {
		let role = localStorage.getItem("role");
		this.role = this.getRoleTable(role);
		
	}

	ngOnInit(): void {
		this.createForm();
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
		this.Form = this.formBuilder.group({
		code: ["", [Validators.required]],
		newPassword: ["", [Validators.required, Validators.minLength(9)]],
		confirmPassword:["", [Validators.required, Validators.minLength(9)]],
		role:[this.role]
		},
		{
		  validator: ConfirmMatch('newPassword', 'confirmPassword')}
		);
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
      this.authService.resetPassword(this.Form.value).subscribe(res => {
        if (res.success) {
          this.toastr.success(res.message);
          this.Form.reset();
          this.submitted = false;
          this.router.navigate(['/']);
        } else {
          this.toastr.error(res.message);
        }
        this.spinner.hide();
      },
        error => {
          this.spinner.hide();
          // this.toastr.error(error);
        }
      )
    }
	}

  
	ngOnDestroy(): void {
		if (this._loginObservable) {
			this._loginObservable.unsubscribe();
		}
	}
}
