import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordComponent } from './password.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { AlertService } from '../../../services/alert.service';
import { AccountService } from '../../../services/account.service';
import { of, throwError } from 'rxjs';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;

  const fakeAlertService = createSpyObj('AlertService', [
    'success',
    'error',
    'clear'
  ]);
  const fakeAccountService = createSpyObj('AccountService', [
    'checkPassword',
    'updatePassword',
    'user'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordComponent],
      providers: [
        FormBuilder,
        HttpClient,
        HttpHandler,
        {
          provide: AlertService,
          useValue: fakeAlertService
        },
        {
          provide: AccountService,
          useValue: fakeAccountService
        }
      ]
    }).compileComponents();

    fakeAccountService.user = of({});

    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init component', () => {
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
        current_password: new FormControl('test'),
        new_password: new FormControl('test1'),
        new_password_2: new FormControl('test1')
      });
    });

    it('should edit password', () => {
      fakeAccountService.checkPassword.and.returnValue(of({}));
      fakeAccountService.updatePassword.and.returnValue(of({}));
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.success).toHaveBeenCalled();
      expect(fakeAccountService.checkPassword).toHaveBeenCalled();
      expect(fakeAccountService.updatePassword).toHaveBeenCalled();
    });

    it('should show error if password is incorrect', () => {
      fakeAccountService.checkPassword.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
      expect(fakeAccountService.checkPassword).toHaveBeenCalled();
    });

    it('should show error if password update not succeed', () => {
      fakeAccountService.checkPassword.and.returnValue(of({}));
      fakeAccountService.updatePassword.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
      expect(fakeAccountService.checkPassword).toHaveBeenCalled();
      expect(fakeAccountService.updatePassword).toHaveBeenCalled();
    });
  });
});
