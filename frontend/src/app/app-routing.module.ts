import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';

const accountModule = () =>
  import('./components/account/account.module').then((x) => x.AccountModule);

const companyModule = () =>
  import('./components/company/company.module').then((x) => x.CompanyModule);

const employmentModule = () =>
  import('./components/employment/employment.module').then(
    (x) => x.EmploymentModule
  );

const positionModule = () =>
  import('./components/position/position.module').then((x) => x.PositionModule);

const userModule = () =>
  import('./components/user/user.module').then((x) => x.UserModule);

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'account', loadChildren: accountModule },
  { path: 'company', loadChildren: companyModule },
  { path: 'employment', loadChildren: employmentModule },
  { path: 'position', loadChildren: positionModule },
  { path: 'user', loadChildren: userModule },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
