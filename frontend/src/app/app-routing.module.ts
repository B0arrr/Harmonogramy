import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NgModule } from '@angular/core';
import { ScheduleComponent } from './components/schedule/schedule.component';

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
  {
    path: 'home',
    component: LayoutComponent,
    children: [{ path: '', component: HomeComponent }]
  },
  {
    path: 'schedule',
    component: LayoutComponent,
    children: [{ path: '', component: ScheduleComponent }]
  },
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
