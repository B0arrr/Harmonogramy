import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, first } from 'rxjs';
import { AccountService } from '../../../services/account.service';
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
  userLoggedIn?: User | null;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private companyService: CompanyService,
    private employmentService: EmploymentService,
    private positionService: PositionService,
    private activatedRoute: ActivatedRoute,
    private accountService: AccountService
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
    this.accountService.user.subscribe((user) => (this.userLoggedIn = user));
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      is_employed: ['', Validators.required],
      date_of_fired: [''],
      company_id: ['', Validators.required],
      employment_id: ['', Validators.required],
      position_id: ['', Validators.required]
    });
    if (!this.user?.is_superuser) {
      this.form.controls['company_id'].setValue(1);
    }
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
    let date_of_fired = this.f['date_of_fired'].value;
    const company_id = this.f['company_id'].value;
    const employment_id = this.f['employment_id'].value;
    const position_id = this.f['position_id'].value;
    date_of_fired == '' ? (date_of_fired = null) : date_of_fired;

    this.loading = true;
    let update: Observable<User>;
    if (this.user?.id == this.userLoggedIn?.id) {
      update = this.accountService
        .update(this.user?.id as number, {
          ...this.user,
          is_employed,
          date_of_fired,
          company_id,
          employment_id,
          position_id
        })
        .pipe(first());
    } else {
      update = this.userService.updateUser({
        ...this.user,
        is_employed,
        date_of_fired,
        company_id,
        employment_id,
        position_id
      });
    }
    update.subscribe({
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
