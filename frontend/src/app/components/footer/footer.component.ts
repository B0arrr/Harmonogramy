import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  year: string | undefined;
  constructor(private datePipe: DatePipe) {
    this.year = this.datePipe.transform(new Date(), 'yyyy')?.toString();
  }
}
