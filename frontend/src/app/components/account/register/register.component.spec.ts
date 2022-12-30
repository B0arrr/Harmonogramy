import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHandler } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { AccountService } from '../../../services/account.service';
import { AlertService } from '../../../services/alert.service';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const fakeActivatedRoute = {
    snapshot: {
      paramMap: {
        get(): string {
          return '123';
        }
      }
    }
  };

  const fakeRouter = createSpyObj('Router', ['navigate']);
  const fakeAccountService = createSpyObj('AccountService', ['register']);
  const fakeAlertService = createSpyObj('AlertService', [
    'clear',
    'success',
    'error'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute
        },
        {
          provide: Router,
          useValue: fakeRouter
        },
        {
          provide: AccountService,
          useValue: fakeAccountService
        },
        {
          provide: AlertService,
          useValue: fakeAlertService
        },
        HttpClient,
        HttpHandler
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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
        first_name: new FormControl('test'),
        last_name: new FormControl('test'),
        email: new FormControl('test@test.pl'),
        password: new FormControl('testtest')
      });
    });

    it('should register user', () => {
      fakeAccountService.register.and.returnValue(of({}));
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.success).toHaveBeenCalled();
      expect(fakeRouter.navigate).toHaveBeenCalled();
    });

    it('should show error if register not succeed', () => {
      fakeAccountService.register.and.returnValue(
        throwError(() => new Error(''))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });
  });
});
