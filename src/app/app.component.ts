import { Component } from '@angular/core';
import { ScrollTopService } from './shared/scrolltop.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sanoo';

  constructor( private scrollTopService: ScrollTopService
    ) {}
    
    ngOnInit() {
    this.scrollTopService.setScrollTop();
    }
}
