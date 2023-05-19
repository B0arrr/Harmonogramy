import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponent } from './edit.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';
import { CompanyService } from '../../../services/company.service';
import { EmploymentService } from '../../../services/employment.service';
import { PositionService } from '../../../services/position.service';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../../models/user';
import { AccountService } from '../../../services/account.service';

describe('EditUserComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  const fakeAlertService = createSpyObj('AlertService', [
    'success',
    'error',
    'clear'
  ]);
  const fakeUserService = createSpyObj('UserService', [
    'updateUser',
    'getUserById'
  ]);
  const fakeCompanyService = createSpyObj('CompanyService', [
    'getAllCompanies'
  ]);
  const fakeEmploymentService = createSpyObj('EmploymentService', [
    'getAllEmployments'
  ]);
  const fakePositionService = createSpyObj('PositionService', [
    'getAllPositions'
  ]);
  const fakeAccountService = createSpyObj('AccountService', ['update']);

  const fakeActivatedRoute = {
    snapshot: {
      params: {
        id: 1
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        HttpClient,
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: fakeActivatedRoute
        },
        {
          provide: AlertService,
          useValue: fakeAlertService
        },
        {
          provide: UserService,
          useValue: fakeUserService
        },
        {
          provide: CompanyService,
          useValue: fakeCompanyService
        },
        {
          provide: EmploymentService,
          useValue: fakeEmploymentService
        },
        {
          provide: PositionService,
          useValue: fakePositionService
        },
        {
          provide: AccountService,
          useValue: fakeAccountService
        }
      ]
    }).compileComponents();

    fakeUserService.getUserById.and.returnValue(of({}));
    fakeCompanyService.getAllCompanies.and.returnValue(of([]));
    fakeEmploymentService.getAllEmployments.and.returnValue(of([]));
    fakePositionService.getAllPositions.and.returnValue(of([]));
    fakeAccountService.user = of(null);
    fakeAccountService.update.and.returnValue(of({}));

    fixture = TestBed.createComponent(EditComponent);
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
        is_employed: new FormControl('test'),
        date_of_fired: new FormControl('test'),
        company_id: new FormControl('test'),
        employment_id: new FormControl('test'),
        position_id: new FormControl('test')
      });
      component.user = new User();
      component.userLoggedIn = new User();
      component.user.id = 1;
      component.userLoggedIn.id = 2;
    });

    it('should update user', () => {
      fakeUserService.updateUser.and.returnValue(of({}));
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.success).toHaveBeenCalled();
      expect(fakeUserService.updateUser).toHaveBeenCalled();
    });

    it('should update logged in user', () => {
      fakeUserService.updateUser.and.returnValue(of({}));
      component.userLoggedIn = new User();
      component.userLoggedIn.id = 1;
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.success).toHaveBeenCalled();
      expect(fakeAccountService.update).toHaveBeenCalled();
    });

    it('should show error', () => {
      fakeUserService.updateUser.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(fakeUserService.updateUser).toHaveBeenCalled();
    });

    it('should show error while edit logged user', () => {
      fakeAccountService.update.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.userLoggedIn = new User();
      component.userLoggedIn.id = 1;
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(fakeAccountService.update).toHaveBeenCalled();
    });
  });
});
