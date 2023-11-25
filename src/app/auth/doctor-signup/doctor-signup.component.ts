import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import roleArray from 'src/app/shared/roleArray';
import { AuthService } from '../auth.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import languagesList from 'src/app/shared/languagesList';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { environment } from 'src/environments/environment.prod';
import { ConfirmMatch } from 'src/app/shared/confirm-match.validator';

@Component({
  selector: 'app-doctor-signup',
  templateUrl: './doctor-signup.component.html',
  styleUrls: ['./doctor-signup.component.scss']
})
export class DoctorSignupComponent implements OnInit {

  public Form: FormGroup;
	submitted = false;
	_host = environment.url;
	dImg = '/assets/img/no-image.jpg';
	public rememberMe: boolean = false;
	passwordType: boolean;
	role: any="";
	hospitals = [];
	public languages = languagesList;

	myOptions:IMultiSelectOption[];
	myInsurances:IMultiSelectOption[] = [];
	mySpecialties:IMultiSelectOption[] = [];
	myservices:IMultiSelectOption[] = [];
	mySettings: IMultiSelectSettings = {
		enableSearch: true,
		checkedStyle: 'fontawesome',
		buttonClasses: 'btn btn-default btn-block',
		dynamicTitleMaxItems: 3,
		displayAllSelectedText: true
	  };

	_authSubscription:any;
	imageBase:any;
	filesAmount = 0;
	fileToUpload:any;
	images = [];
	isAddressSelected = false;
	

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private spinner:NgxSpinnerService,
		private toastr:ToastrService,
		private dashboardService: DashboardService,
		private authService:AuthService
	) {
		let role = localStorage.getItem("role");
		this.role = this.getRoleTable(role);

		this.myOptions = this.languages.map((item, i)=>{
			return {id: item, name: item}
		});
	
		this.getHospitals();
		this.getInsurance();
		this.getSpecialties();
	}

	ngOnInit(): void {
		this.createForm();
	}

	markRemember() {
		this.rememberMe = !this.rememberMe;
	}

	createForm() {
    this.Form = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^((?!\s{2,}).)*$/)]],
      role: ['doctors', Validators.required],
      mobileNo: ['', [Validators.required, Validators.min(1000000000)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%. +-]+@[a-z0-9.-]+\\.[a-z]{2,4}.$")]],
      address:[''],
      hospitalId:[''],
      insurances:[[], Validators.required],
      aboutus:[''],
      lat:[''],
      long:[''],
      city:[''],
      country:[''],
      state:[''],
      npi:['', Validators.min(1000000000)],
      visitType:[''],
      gender:['', Validators.required],
      languages:[[], Validators.required],
      image: [],
      password:['', [Validators.required, Validators.minLength(9)]],
      confirmPassword:['', [Validators.required, Validators.minLength(9)]],
      agree:[false],
	  specialties: [[], Validators.required],
	  services: [[], Validators.required],
	  individualType:[false]
    },
	{
	  validator: ConfirmMatch('password', 'confirmPassword')
	});

	this.areIndividual()
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
		if (!this.Form.invalid && isagree && this.isAddressSelected) {
		this.spinner.show();
		this._authSubscription = this.authService.Signup(this.Form.value).subscribe(res => {
			if (res.success) {
			this.Form.reset();
			this.submitted = false;
			this.toastr.success("Successfully signup. Verify you email to login");
			this.router.navigate(['/auth/login/doctor']);
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

	getInsurance() {
		this.spinner.show();
		let filter = {
			status:'active'
		}
		this._authSubscription = this.dashboardService.getAll('insurances', filter).subscribe((response) => {
		  if (response.data && response.data.length > 0) {
			this.myInsurances = response.data.map((item, i)=>{
			  return {id: item.id, name: item.name}
			});
			this.spinner.hide();
	
		  } else {
			this.myInsurances = []
			this.spinner.hide();
		  }
		}, error=> {
		  this.spinner.hide();
		  this.toastr.error(error.message, 'Error');
		});
	}

	addressCheck(){
		this.isAddressSelected = false;
	}

	getSpecialties() {
		this.spinner.show();
		let filter = {
		  status: 'active',
		  isDeleted:false,
		  count:50
		}
		this._authSubscription = this.dashboardService.getAll('categorys', filter).subscribe((response) => {
		  if (response.success) {
			this.mySpecialties = []
			this.myservices = []
			response.data.map((item, i)=>{
			  if(item.type == 'Specialty'){
				this.mySpecialties.push(item)
			  }else if(item.type == 'Service'){
				this.myservices.push(item);
			  }
			
			});
			console.log("mySpecialties", this.mySpecialties)
			this.spinner.hide();
	
		  } else {
			this.mySpecialties = []
			this.myservices = []
			this.spinner.hide();
		  }
		}, error=> {
		  this.spinner.hide();
		});
	}

	getSingleSpecialty(id){
		let value = ''
		this.mySpecialties.map(item=>{
		  if(item.id == id){
			value = item.name
		  }
		})

		this.myservices.map(item=>{
			if(item.id == id){
			  value = item.name
			}
		})
  
		return value;
	}

	getSingleInsurance(id){
		let value = ''
		this.myInsurances.map(item=>{
		  if(item.id == id){
			value = item.name
		  }
		})
  
		return value;
	}

	getHospitals() {
		this.spinner.show();
		let filter = {
			status: 'active'
		  }
		this._authSubscription = this.dashboardService.getAll('hospitals', filter).subscribe((response) => {
		  if (response.data && response.data.length > 0) {
			this.hospitals = response.data;
			this.spinner.hide();
	
		  } else {
			this.hospitals = []
			this.spinner.hide();
		  }
		}, error=> {
		  this.spinner.hide();
		  this.toastr.error(error.message, 'Error');
		});
	}

	uploadImage(files: FileList) {
		if (files && files[0]) {
		  this.filesAmount = files.length;
		  for (let i = 0; i < this.filesAmount; i++) {
			this.spinner.show();
			this.fileToUpload = files.item(i)
			this.uploadSingle(this.fileToUpload, i);
		  }
		}
	}

	areIndividual(){
		if(this.Form.value.individualType == false){
		  this.Form.get('hospitalId').setValidators(Validators.required);
		  this.Form.patchValue({hospitalId:''})
		}
		else{
		  this.Form.get('hospitalId').clearValidators()
		  this.Form.patchValue({hospitalId:null})
		}
		this.Form.controls['hospitalId'].updateValueAndValidity();
	  }
  
  
	  uploadSingle(fileToUpload, i){
		this.spinner.show();
		this.dashboardService.uploadImage(fileToUpload, 'users').subscribe((res: any) => {
		  if (res.success) {
			let image = res.data.fullPath;
  
			if(image){
			  this.images.push(image);
		
			  this.Form.patchValue({ image: this.images })
			}
			
		  } else {
			window.scrollTo(0, 0);
			this.toastr.error(res.error.message, 'Error');
		  }
  
		
		  if(i>= this.filesAmount-1){
			this.spinner.hide();
			this.imageBase = '';
		  }
		}, err => {
		  if(i>= this.filesAmount-1){
			this.spinner.hide();
			this.imageBase = '';
		  }
		});
	  }
  

	public handleAddressChange(address) {
	
		let lat = address.geometry.location.lat()
		let lng = address.geometry.location.lng()
		let aArray:any = address.address_components;
	
		this.isAddressSelected = true;
	
		const getAddress = (i)=>{
		  return aArray[aArray.length-i].long_name
		}
	
		this.Form.patchValue({lat,long: lng, address:address.formatted_address, country:getAddress(1), state:getAddress(2), city:getAddress(3)})
		

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

	removeImage(i){
		this.images = this.images.filter((item, j) => i !== j);
		this.Form.patchValue({image:this.images})
	}
  
	ngOnDestroy(): void {
		if (this._authSubscription) {
			this._authSubscription.unsubscribe();
		}
	}


}
