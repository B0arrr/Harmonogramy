import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { AccountService } from '../../../services/account.service';
import { AlertService } from '../../../services/alert.service';
import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { first } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  form!: FormGroup;
  loading = false;
  submitted = false;
  user?: User | null;
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.accountService.user.subscribe((user) => (this.user = user));
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      first_name: new FormControl(this.user?.first_name?.toString(), [
        Validators.required
      ]),
      last_name: new FormControl(this.user?.last_name?.toString(), [
        Validators.required
      ]),
      email: new FormControl(this.user?.email?.toString(), [
        Validators.required,
        Validators.email
      ])
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

    this.loading = true;
    if (this.user) {
      const first_name = this.f['first_name'].value;
      const last_name = this.f['last_name'].value;
      const email = this.f['email'].value;
      this.accountService
        .update(this.user.id as number, {
          ...this.user,
          first_name,
          last_name,
          email
        })
        .pipe(first())
        .subscribe({
          next: () => {
            this.alertService.success('User edited');
            this.loading = false;
          },
          error: (error) => {
            this.alertService.error(error);
            this.loading = false;
          }
        });
    }
  }
}
