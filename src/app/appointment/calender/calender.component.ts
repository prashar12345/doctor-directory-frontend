import { Component, OnInit } from '@angular/core';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';
import {
  CalendarEvent,
  CalendarView,
} from 'angular-calendar';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

  user:any;


  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  activeDayIsOpen: boolean = true;
  eventsCalendar: CalendarEvent[] = [];
  modalData:any;
  viewMdal = false;
  refresh: Subject<any> = new Subject();

  constructor(private spinner: NgxSpinnerService,
    private dashboardService: DashboardService) { 
      this.user = JSON.parse(localStorage.getItem('credentials'));
    }

  ngOnInit() {
    this.getEvents()
  }

  loadData() {
    document.getElementById("monthClickid").click();
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.viewMdal = true;
  }

  close() {
    this.viewMdal = false;
  }

  getEvents() {
    let filters = {
      userId: this.user.id
    }
    this.spinner.show()
    this.dashboardService.getAll('schedules', filters).subscribe((res: any) => {
      if (res.success) {
        this.eventsCalendar = res.data.map((element) => {
          let status = element.status
          // element.start = element.start
          // element.end = element.end
          if (element['bookedBy']) {
            if (element['status']) {

            } else {

              status = 'pending';
            }

          }

          return {
            id: element.id,
            start: new Date(element.start),
            isBooked: element.isBooked,
            isDeleted: element.isDeleted,
            scheduleType: element.scheduleType,
            // actions: actions,
            status: status,
            title: element.title
          }

        });

        if(this.eventsCalendar.length>0){
          this.viewDate = this.eventsCalendar[0].start;
          this.loadData()
        }
        
      }

      this.spinner.hide()

    },error=>{
      this.spinner.hide();
    });
  }

}
