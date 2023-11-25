import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from '../dashboard.service';
import { BehaviorService } from 'src/app/shared/behavior.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  public Form: FormGroup;
  submitted = false;
  _roleObservable:any;
  user:any;
  token:any;
  ID:any;
  userRole:any;
  fileToUpload:any;
  dImg = '/assets/img/placeholder.jpg';
  image: '';
  imageBase:any;
  isEdit = false;
  _host = environment.url;

  constructor(
    private formBuilder: FormBuilder,
    private toastr:ToastrService,
    private spinner:NgxSpinnerService,
    private dashboardService: DashboardService,
    private _bs: BehaviorService,
    private router:Router
  ) {
    let user:any = JSON.parse(localStorage.getItem("credentials"));
    this.ID = user.id;
    this.userRole = user.role;
  }

  ngOnInit() {
    this.createForm();
    this.getSingle();
  }

  view(){
    this.isEdit = !this.isEdit;
    let image = ''
    if(this.isEdit){
      image = this.image?this.image:this.user.image;
    }else{
      image = this.user.image
    }
      
      this.Form.patchValue({image})
  }

  getSingle(){
    this.spinner.show();
    this.dashboardService.get(`user?id=${this.ID}&role=${this.userRole}`).subscribe((res: any) => {
      if (res.success) {
        console.log(res, "res role")
        let data = res.data;
        this.user = data;
        this.Form.patchValue({firstName: data.firstName, lastName: data.lastName, 
          email:data.email,mobileNo:data.mobileNo, image:data.image, gender:data.gender
        })
      } else {
        this.toastr.error(res.error.message, 'Error');
      }
      this.spinner.hide();
    },
      error => {
        this.spinner.hide();
      });
  }

  createForm() {
		this.Form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      role:['patients'],
      gender:['',Validators.required],
      id:[this.ID],
	    image:['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.min(1000000000)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%. +-]+@[a-z0-9.-]+\\.[a-z]{2,4}.$")]]
    });
	}

  get f() { return this.Form.controls; }

  onSubmit() {
		this.submitted = true;
		if (!this.Form.invalid) {
		this.spinner.show();
		this._roleObservable = this.dashboardService.update(this.Form.value, `editProfile?id=${this.ID}`).subscribe(res => {
			let url;
			if (res.success) {
				this.token = localStorage.getItem("token");
				this.user.image = this.Form.value.image || ''
        this.user.firstName = this.Form.value.firstName;
				this.user['access_token']=this.token
				const storage = localStorage;
				storage.setItem('user', JSON.stringify(this.user));
				this._bs.setUserData(this.user);
			  this.toastr.success('Profile updated successfully!');
        this.isEdit = false;

			  
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

  uploadImage(files: FileList) {
		if (files && files[0]) {
		  var filesAmount = files.length;
		  for (let i = 0; i < filesAmount; i++) {
			this.fileToUpload = files.item(i)
		  }
		}
	
		let type = 'users'
	
		if (this.fileToUpload) {
		  this.spinner.show();
		  this.dashboardService.uploadImage(this.fileToUpload, type).subscribe((res: any) => {
			if (res.success) {
			  let image = res.data.fullPath;
        this.image = image;
			  this.Form.patchValue({image:image})
			  this.imageBase = '';
			} else {
			  window.scrollTo(0, 0);
			  this.toastr.error(res.error.message, 'Error');
			}
			this.spinner.hide();
		  }, err => {
			this.imageBase = '';
			this.spinner.hide();
		  });
		}
	}

  ngOnDestroy(): void {
		if (this._roleObservable) {
		  this._roleObservable.unsubscribe();
		}
	}

}
