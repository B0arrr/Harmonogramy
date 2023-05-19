import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComponent } from './add.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import { AlertService } from '../../../services/alert.service';
import { EmploymentService } from '../../../services/employment.service';
import { TranslateModule } from '@ngx-translate/core';

describe('AddEmploymentComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  const fakeAlertService = createSpyObj('AlertService', [
    'success',
    'error',
    'clear'
  ]);
  const fakeEmploymentService = createSpyObj('EmploymentService', [
    'addEmployment'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        HttpClient,
        HttpHandler,
        {
          provide: AlertService,
          useValue: fakeAlertService
        },
        {
          provide: EmploymentService,
          useValue: fakeEmploymentService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddComponent);
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
        employment: new FormControl('test'),
        hours_per_day: new FormControl(1),
        hours_per_week: new FormControl(1)
      });
    });

    it('should add company', () => {
      fakeEmploymentService.addEmployment.and.returnValue(of({}));
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.success).toHaveBeenCalled();
      expect(fakeEmploymentService.addEmployment).toHaveBeenCalled();
    });

    it('should show error', () => {
      fakeEmploymentService.addEmployment.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(fakeEmploymentService.addEmployment).toHaveBeenCalled();
    });
  });
});
