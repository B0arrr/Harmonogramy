import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AccountService } from '../../services/account.service';
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const fakeAccountService = createSpyObj('AccountService', [
    'logout',
    'tokenValue',
    'token'
  ]);
  const fakeCompanyService = createSpyObj('CompanyService', ['getCompanyName']);

  fakeAccountService.token = of({});
  fakeAccountService.user = of({});
  fakeCompanyService.getCompanyName.and.returnValue(of('test'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        HttpClient,
        HttpHandler,
        {
          provide: AccountService,
          useValue: fakeAccountService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.token).not.toBeNull();
    expect(component.title).not.toBeNull();
    expect(component.user).not.toBeNull();
    expect(component.company).not.toBeNull();
  });

  describe('logout', () => {
    it('should call logout', () => {
      component.logout();
      expect(fakeAccountService.logout).toHaveBeenCalled();
    });
  });
});
