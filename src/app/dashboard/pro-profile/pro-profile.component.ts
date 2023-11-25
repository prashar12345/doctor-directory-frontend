import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from '../dashboard.service';
import { BehaviorService } from 'src/app/shared/behavior.service';
import { environment } from 'src/environments/environment';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import languagesList from 'src/app/shared/languagesList';

@Component({
  selector: 'app-pro-profile',
  templateUrl: './pro-profile.component.html',
  styleUrls: ['./pro-profile.component.scss']
})
export class ProProfileComponent implements OnInit {

  public Form: FormGroup;
  submitted = false;
  _roleObservable: any;
  user: any;
  token: any;
  ID: any;
  userRole: any;
  fileToUpload: any;
  dImg = '/assets/img/placeholder.jpg';
  imageBase: any;
  isEdit = false;
  _host = environment.url;
  data: any;

  filesAmount = 0;
  images = [];

  myOptions: IMultiSelectOption[] = [];
  myInsurances: IMultiSelectOption[] = [];
  mySpecialties: IMultiSelectOption[] = [];
  myServices: IMultiSelectOption[] = [];
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
  };
  public languages = languagesList;
  hospitals = []
  isAddressSelected = false;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private dashboardService: DashboardService,
    private _bs: BehaviorService
  ) {
    let user: any = JSON.parse(localStorage.getItem("credentials"));
    this.ID = user.id;
    this.userRole = user.role;
  }

  ngOnInit() {
    this.createForm();
    this.getInsurance()
    this.getHospitals()
    this.getSpecialties()

    this.myOptions = this.languages.map((item, i) => {
      return { id: item, name: item }
    });

    this.getSingle();
  }

  getSingle() {
    this.spinner.show();
    this.dashboardService.get(`user?id=${this.ID}&role=${this.userRole}`).subscribe((res: any) => {
      if (res.success) {
        console.log(res, "res role")
        let data = res.data;
        this.data = data;
        this.user = data;

        if (data.address) {
          this.isAddressSelected = true;
        }

        if (data.image) {
          this.images = data.image;
        }


        let services = []
        let specialties = []

        if (data.specialties) {
          specialties = data.specialties.map(item => {
            return item.id
          })
        }

        if (data.services) {
          services = data.services.map(item => {
            return item.id
          })
        }

        this.areIndividual()

        this.Form.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          experience: data.experience,
          education: data.education,
          qualification: data.qualification,
          email: data.email,
          mobileNo: data.mobileNo,
          image: data.image,
          gender: data.gender,
          aboutus: data.aboutus,
          visitType: data.visitType,
          specialties: specialties,
          services: services,
          languages: data.languages,
          npi: data.mobileNo,
          individualType: data.individualType,
          hospitalId: data.hospitalId ? data.hospitalId : '',
          insurances: data.insurances,
          address: data.address,
          country: data.country,
          city: data.city,
          state: data.state,
          lat: data.lat,
          long: data.long
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
      experience: ['', [Validators.required, Validators.max(50)]],
      education: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      role: ['doctors'],
      gender: ['', Validators.required],
      id: [this.ID],
      image: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.min(1000000000)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%. +-]+@[a-z0-9.-]+\\.[a-z]{2,4}.$")]],
      address: ['', Validators.required],
      hospitalId: [''],
      individualType: [false],
      insurances: [[], Validators.required],
      aboutus: [''],
      visitType: [''],
      languages: [[], Validators.required],
      specialties: [[], Validators.required],
      services: [[], Validators.required],
      npi: [''],
      lat: [''],
      long: [''],
      city: [''],
      country: [''],
      state: [''],
    });

    this.areIndividual()
  }

  get f() { return this.Form.controls; }

  onSubmit() {
    this.submitted = true;
    if (!this.Form.invalid && this.isAddressSelected) {
      this.spinner.show();
      this._roleObservable = this.dashboardService.update(this.Form.value, `editProfile?id=${this.ID}`).subscribe(res => {
        let url;
        if (res.success) {
          this.submitted = false;
          this.token = localStorage.getItem("token");
          this.user.image = this.Form.value.image || '';
          this.user.firstName = this.Form.value.firstName;
          this.user.visitType = this.Form.value.visitType;
          this.user['access_token'] = this.token
          const storage = localStorage;
          storage.setItem('user', JSON.stringify(this.user));
          this._bs.setUserData(this.user);
          this.toastr.success('Profile Updated Successfully!');
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

  addressCheck() {
    this.isAddressSelected = false;
  }

  areIndividual() {
    if (this.Form.value.individualType == false) {
      this.Form.get('hospitalId').setValidators(Validators.required);
      this.Form.patchValue({ hospitalId: '' })
    }
    else {
      this.Form.get('hospitalId').clearValidators()
      this.Form.patchValue({ hospitalId: null })
    }
    this.Form.controls['hospitalId'].updateValueAndValidity();
  }

  public handleAddressChange(address) {
    console.log("address", address);
    let lat = address.geometry.location.lat()
    let lng = address.geometry.location.lng()
    let aArray: any = address.address_components;
    console.log("aArray", aArray);
    this.isAddressSelected = true;

    const getAddress = (i) => {
      return aArray[aArray.length - i].long_name
    }

    this.Form.patchValue({ lat, long: lng, address: address.formatted_address, country: getAddress(1), state: getAddress(2), city: getAddress(3) })

    console.log("gfd", this.Form.value)
  }


  getInsurance() {
    this.spinner.show();
    let filter = {
      isDeleted: false,
      status: 'active'
    }
    this._roleObservable = this.dashboardService.getAll('insurances', filter).subscribe((response) => {
      if (response.data && response.data.length > 0) {
        this.myInsurances = response.data.map((item, i) => {
          return { id: item.id, name: item.name }
        });
        this.spinner.hide();

      } else {
        this.myInsurances = []
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error(error.message, 'Error');
    });
  }

  getSpecialties() {
    this.spinner.show();
    let filter = {
      status: 'active',
      isDeleted: false,
      count: 50
    }
    this._roleObservable = this.dashboardService.getAll('categorys', filter).subscribe((response) => {
      if (response.success) {
        this.mySpecialties = []
        this.myServices = []
        response.data.map((item, i) => {
          if (item.type == 'Specialty') {
            this.mySpecialties.push(item)
          } else if (item.type == 'Service') {
            this.myServices.push(item);
          }

        });

        this.spinner.hide();

      } else {
        this.mySpecialties = []
        this.myServices = []
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  getHospitals() {
    this.spinner.show();
    let filter = {
      isDeleted: false,
      status: 'active'
    }
    this._roleObservable = this.dashboardService.getAll('hospitals', filter).subscribe((response) => {
      if (response.data && response.data.length > 0) {
        this.hospitals = response.data;
        this.spinner.hide();

      } else {
        this.hospitals = []
        this.spinner.hide();
      }
    }, error => {
      this.spinner.hide();
    });
  }

  getSingleInsurance(id) {
    let value = ''
    this.myInsurances.map(item => {
      if (item.id == id) {
        value = item.name
      }
    })

    return value;
  }

  getSingleSpecialty(id) {
    let value = ''
    this.mySpecialties.map(item => {
      if (item.id == id) {
        value = item.name
      }
    })

    this.myServices.map(item => {
      if (item.id == id) {
        value = item.name
      }
    })

    return value;
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

  uploadSingle(fileToUpload, i) {
    this.spinner.show();
    this.dashboardService.uploadImage(fileToUpload, 'users').subscribe((res: any) => {
      if (res.success) {
        let image = res.data.fullPath;

        if (image) {
          this.images.push(image);
          // console.log('this.images',this.images)
          this.Form.patchValue({ image: this.images })
        }

      } else {
        window.scrollTo(0, 0);
        this.toastr.error(res.error.message, 'Error');
      }

      console.log("this.filesAmount", this.filesAmount, "i", i)
      if (i >= this.filesAmount - 1) {
        this.spinner.hide();
        this.imageBase = '';
      }
    }, err => {
      if (i >= this.filesAmount - 1) {
        this.spinner.hide();
        this.imageBase = '';
      }
    });
  }

  removeImage(i) {
    this.images = this.images.filter((item, j) => i !== j);
    this.Form.patchValue({ image: this.images })
  }

  ngOnDestroy(): void {
    if (this._roleObservable) {
      this._roleObservable.unsubscribe();
    }
  }

}
