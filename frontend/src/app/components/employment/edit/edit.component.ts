import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { EmploymentService } from '../../../services/employment.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  id?: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private employmentService: EmploymentService,
    private alertService: AlertService
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      employment: ['', Validators.required]
      // hours_per_day: ['', Validators.required],
      // hours_per_week: ['', Validators.required]
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
    // const max_hours_per_day = this.f['hours_per_day'].value;
    // const max_hours_per_week = this.f['hours_per_week'].value;

    this.loading = true;
    this.employmentService
      .updateEmployment(this.id as number, employment)
      .subscribe({
        next: () => {
          this.alertService.success('Employment added');
          this.loading = false;
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
