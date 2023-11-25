import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StripHtmlPipe} from './pipes/striphtml'


@NgModule({
  declarations: [StripHtmlPipe],
  imports: [
    CommonModule, 
  ],
  exports:[
    StripHtmlPipe
  ]
})
export class SharedModule { }
