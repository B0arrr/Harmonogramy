import { AddComponent } from './add/add.component';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { EmploymentRoutingModule } from './employment-routing.module';
import { EmploymentsComponent } from './employments/employments.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, EmploymentRoutingModule],
  declarations: [EmploymentsComponent, AddComponent, EditComponent]
})
export class EmploymentModule {}
