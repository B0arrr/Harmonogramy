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
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
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
      current_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      new_password_2: new FormControl('', [Validators.required])
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
      const password: string = this.f['current_password'].value;
      const new_password: string = this.f['new_password'].value;
      const new_password_2: string = this.f['new_password_2'].value;

      if (new_password !== new_password_2) {
        this.alertService.error('Passwords are different');
        this.loading = false;
        return;
      }

      const email = this.user.email;

      this.accountService.checkPassword({ email, password }).subscribe({
        next: (user: User) => {
          this.accountService
            .updatePassword(user.id as number, { password: new_password })
            .pipe(first())
            .subscribe({
              next: () => {
                this.alertService.success('Password updated');
                this.loading = false;
              },
              error: (error) => {
                this.alertService.error(error.detail);
                this.loading = false;
              }
            });
        },
        error: (error) => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
    }
  }
}
