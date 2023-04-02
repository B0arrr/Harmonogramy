import { AddComponent } from './add/add.component';
import { CommonModule } from '@angular/common';
import { CompaniesComponent } from './companies/companies.component';
import { CompanyRoutingModule } from './company-routing.module';
import { EditComponent } from './edit/edit.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, CompanyRoutingModule],
  declarations: [CompaniesComponent, AddComponent, EditComponent]
})
export class CompanyModule {}
