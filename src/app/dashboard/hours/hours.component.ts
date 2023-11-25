import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.scss']
})
export class HoursComponent implements OnInit {

  data:any = []
  viewModal = false;
  editModal = false;
  viewData:any;
  filters: { page: Number, count : Number,total:Number, userId:string, status:string} = { page: 1, count:5, total:0, userId: '', status:''}; 


  days = [
    {day:'Mon', start:'', end: '', isOpen:false},
    {day:'Tus', start:'', end: '', isOpen:false},
    {day:'Wed', start:'', end: '', isOpen:false},
    {day:'Thu', start:'', end: '', isOpen:false},
    {day:'Fri', start:'', end: '', isOpen:false},
    {day:'Sat', start:'', end: '', isOpen:false},
    {day:'Sun', start:'', end: '', isOpen:false},
  ]

  constructor() { }

  ngOnInit() {
    this.getData()
  }

  view(item){
    this.viewModal = true;
    this.viewData = item;
  }

  edit(item){
    this.viewData = item;
    this.editModal = true;
  }

  getData(){
    this.data = [
      {address:'Shibzada Ajit Singh Nagar, Punjab, India', id:'fdhgfhgf'},
      {address:'Chandigarh, India', id:'fdhgfhfghgfhgf'},
      {address:'Mohali', id:'fdhhgfgfhgf'},
      {address:'Shibzada Ajit Singh, Fortise Hospital', id:'fdhgfhgjhgjf'},
    ]
  }

  isOpen(i){
    if(this.days[i].isOpen == false){
      this.days[i].start = '';
      this.days[i].end = '';
    }
  }

}
