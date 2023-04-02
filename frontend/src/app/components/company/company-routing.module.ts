import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './add/add.component';
import { CompaniesComponent } from './companies/companies.component';
import { EditComponent } from './edit/edit.component';
import { LayoutComponent } from '../layout/layout.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: CompaniesComponent },
      { path: 'add', component: AddComponent },
      { path: 'edit/:id', component: EditComponent },

      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}
