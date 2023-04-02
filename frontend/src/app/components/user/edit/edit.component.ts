import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../services/alert.service';
import { Company } from '../../../models/company';
import { CompanyService } from '../../../services/company.service';
import { Employment } from '../../../models/employment';
import { EmploymentService } from '../../../services/employment.service';
import { Position } from '../../../models/position';
import { PositionService } from '../../../services/position.service';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  submitted = false;
  companies?: Company[] | null;
  employments?: Employment[] | null;
  positions?: Position[] | null;
  id?: number;
  user?: User;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private companyService: CompanyService,
    private employmentService: EmploymentService,
    private positionService: PositionService,
    private activatedRoute: ActivatedRoute
  ) {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.userService
      .getUserById(this.id as number)
      .subscribe((user) => (this.user = user));
    this.companyService
      .getAllCompanies()
      .subscribe((companies) => (this.companies = companies));
    this.employmentService
      .getAllEmployments()
      .subscribe((employments) => (this.employments = employments));
    this.positionService
      .getAllPositions()
      .subscribe((positions) => (this.positions = positions));
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      is_employed: ['', Validators.required],
      date_of_fired: ['', Validators.required],
      company_id: ['', Validators.required],
      employment_id: ['', Validators.required],
      position_id: ['', Validators.required]
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

    const is_employed = this.f['is_employed'].value;
    const date_of_fired = this.f['date_of_fired'].value;
    const company_id = this.f['company_id'].value;
    const employment_id = this.f['employment_id'].value;
    const position_id = this.f['position_id'].value;

    this.loading = true;
    this.userService
      .updateUser({
        ...this.user,
        is_employed,
        date_of_fired,
        company_id,
        employment_id,
        position_id
      })
      .subscribe({
        next: () => {
          this.alertService.success('User updated');
          this.loading = false;
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}
