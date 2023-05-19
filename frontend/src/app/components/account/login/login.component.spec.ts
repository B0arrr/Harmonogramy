import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AlertService } from '../../../services/alert.service';
import { AccountService } from '../../../services/account.service';
import { of, throwError } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import { TranslateModule } from '@ngx-translate/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      paramMap: {
        get(): string {
          return '123';
        }
      },
      queryParams: {
        returnUrl: 'test'
      }
    }
  };

  const fakeAlertService = createSpyObj('AlertService', ['clear', 'error']);
  const fakeAccountService = createSpyObj('AccountService', ['login']);
  const fakeRouter = createSpyObj('Router', ['navigateByUrl']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute
        },
        HttpClient,
        HttpHandler,
        {
          provide: AlertService,
          useValue: fakeAlertService
        },
        {
          provide: AccountService,
          useValue: fakeAccountService
        },
        {
          provide: Router,
          useValue: fakeRouter
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init form', () => {
      component.ngOnInit();
      expect(component.form).not.toBeNull();
    });
  });

  describe('f', () => {
    it('should return form controls', () => {
      const result = component.f;
      expect(result).not.toBeNull();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.form = new FormGroup({
        username: new FormControl('test'),
        password: new FormControl('test')
      });
    });

    it('should login user', () => {
      fakeAccountService.login.and.returnValue(of({}));
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeRouter.navigateByUrl).toHaveBeenCalled();
    });

    it('should show error if login not succeed', () => {
      fakeAccountService.login.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });
  });
});
