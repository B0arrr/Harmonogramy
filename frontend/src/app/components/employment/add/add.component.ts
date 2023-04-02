import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { EmploymentService } from '../../../services/employment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private employmentService: EmploymentService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      employment: ['', Validators.required],
      hours_per_day: ['', Validators.required],
      hours_per_week: ['', Validators.required]
    });
  }
  get f(): any {
    return this.form.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    this.alertService.clear();

    if (this.form.invalid) {
      return;
    }

    const employment = this.f['employment'].value;
    const max_hours_per_day = this.f['hours_per_day'].value;
    const max_hours_per_week = this.f['hours_per_week'].value;

    this.loading = true;
    this.employmentService
      .addEmployment({ employment, max_hours_per_day, max_hours_per_week })
      .subscribe({
        next: () => {
          this.alertService.success('Company added');
          this.loading = false;
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
