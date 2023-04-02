import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AccountRoutingModule } from './components/account/account-routing.module';
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CompanyRoutingModule } from './components/company/company-routing.module';
import { EmploymentRoutingModule } from './components/employment/employment-routing.module';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { NgModule } from '@angular/core';
import { PositionRoutingModule } from './components/position/position-routing.module';
import { UserRoutingModule } from './components/user/user-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AccountRoutingModule,
    CompanyRoutingModule,
    EmploymentRoutingModule,
    PositionRoutingModule,
    UserRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
