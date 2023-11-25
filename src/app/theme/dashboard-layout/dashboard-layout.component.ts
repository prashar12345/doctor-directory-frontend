import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent implements OnInit {

  showSidebar = false;
  constructor(private _router: Router) { 

  		this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
	        	return;
	    	}
	    	if( evt.url.indexOf('/appointment/booking') >=0){
                this.showSidebar = false;                    
            } else {
                    this.showSidebar = true;                               
            }
		})
	
  }

  ngOnInit() {
  }

}
