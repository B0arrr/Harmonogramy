import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponent } from './edit.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import createSpyObj = jasmine.createSpyObj;
import { EmploymentService } from '../../../services/employment.service';
import { AlertService } from '../../../services/alert.service';
import { of, throwError } from 'rxjs';

describe('EditEmploymentComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  const fakeAlertService = createSpyObj('AlertService', [
    'success',
    'error',
    'clear'
  ]);
  const fakeEmploymentService = createSpyObj('EmploymentService', [
    'updateEmployment'
  ]);

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
          provide: EmploymentService,
          useValue: fakeEmploymentService
        }
      ]
    }).compileComponents();

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
        employment: new FormControl('test')
      });
    });

    it('should edit employment', () => {
      fakeEmploymentService.updateEmployment.and.returnValue(of({}));
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.success).toHaveBeenCalled();
      expect(fakeEmploymentService.updateEmployment).toHaveBeenCalled();
    });

    it('should show error', () => {
      fakeEmploymentService.updateEmployment.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(fakeEmploymentService.updateEmployment).toHaveBeenCalled();
    });
  });
});
