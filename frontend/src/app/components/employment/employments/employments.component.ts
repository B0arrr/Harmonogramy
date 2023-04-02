import { Component } from '@angular/core';
import { Employment } from '../../../models/employment';
import { EmploymentService } from '../../../services/employment.service';

@Component({
  selector: 'app-employments',
  templateUrl: './employments.component.html',
  styleUrls: ['./employments.component.css']
})
export class EmploymentsComponent {
  employments?: Employment[] | null;
  constructor(private employmentService: EmploymentService) {
    this.employmentService
      .getAllEmployments()
      .subscribe((employments) => (this.employments = employments));
  }
}
