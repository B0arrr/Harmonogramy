import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponent } from './edit.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { of, throwError } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import { AlertService } from '../../../services/alert.service';
import { AccountService } from '../../../services/account.service';

describe('EditAccountComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  const fakeAlertService = createSpyObj('AlertService', [
    'success',
    'error',
    'clear'
  ]);
  const fakeAccountService = createSpyObj('AccountService', ['update', 'user']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditComponent],
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
        first_name: new FormControl('test'),
        last_name: new FormControl('test'),
        email: new FormControl('test@test.com')
      });
    });

    it('should edit user', () => {
      fakeAccountService.update.and.returnValue(of({}));
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.success).toHaveBeenCalled();
      expect(fakeAccountService.update).toHaveBeenCalled();
    });

    it('should show error if not succeed', () => {
      fakeAccountService.update.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(component.loading).toBeFalse();
      expect(fakeAccountService.update).toHaveBeenCalled();
    });
  });
});
