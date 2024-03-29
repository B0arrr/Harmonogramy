import { AccountRoutingModule } from './account-routing.module';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { LayoutComponent } from '../layout/layout.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { PasswordComponent } from './password/password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    TranslateModule
  ],
  declarations: [
    LayoutComponent,
    LoginComponent,
    RegisterComponent,
    EditComponent,
    PasswordComponent
  ]
})
export class AccountModule {}
