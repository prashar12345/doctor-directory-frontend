import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from 'src/app/auth/credentials.service';
import { BehaviorService } from 'src/app/shared/behavior.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private credentialsService: CredentialsService, private router: Router, private _bs: BehaviorService) { }

  dImg = 'assets/img/placeholder.jpg';
  _host = environment.url;

  toggleMenu = false;
  user: any;
  role: any;

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("credentials"));
    if (this.user) {
      this.role = this.user.role
    }

    this._bs.getUserData().subscribe((res: any) => {
      console.log(res, "res res")
      if (res.firstName) {
        this.user = res;
        localStorage.setItem("credentials", JSON.stringify(this.user));
      }
    });
  }

  toggleBtn() {
    this.toggleMenu = !this.toggleMenu;

    if (this.toggleMenu) {
      this._bs.openModal()
    } else {
      this._bs.closeModal()
    }
  }

  route(url) {
    this.router.navigateByUrl(url)
    this.toggleMenu = false;
  }

  changePassword() {
    let url = '/auth/change-password';
    localStorage.setItem("role", this.user.role)
    this.route(url);
    this.toggleMenu = false;
  }

  logout() {
    this.toggleMenu = false;
    this.credentialsService.logout().subscribe(res => {
      localStorage.clear();
      this.router.navigate(['/auth/login', this.role]);
      this.user = '';
    });
  }
}
