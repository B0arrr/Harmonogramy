import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRoutingModule,
    TranslateModule
  ],
  declarations: [UsersComponent, EditComponent]
})
export class UserModule {}
