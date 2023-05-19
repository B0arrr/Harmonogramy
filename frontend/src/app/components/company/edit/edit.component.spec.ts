import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponent } from './edit.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import createSpyObj = jasmine.createSpyObj;
import { CompanyService } from '../../../services/company.service';
import { AlertService } from '../../../services/alert.service';
import { TranslateModule } from '@ngx-translate/core';

describe('EditCompanyComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;

  const fakeAlertService = createSpyObj('AlertService', [
    'success',
    'error',
    'clear'
  ]);
  const fakeCompanyService = createSpyObj('CompanyService', ['updateCompany']);

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
          provide: CompanyService,
          useValue: fakeCompanyService
        },
        {
          provide: AlertService,
          useValue: fakeAlertService
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
        company: new FormControl('test')
      });
    });

    it('should edit company', () => {
      fakeCompanyService.updateCompany.and.returnValue(of({}));
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.success).toHaveBeenCalled();
      expect(fakeCompanyService.updateCompany).toHaveBeenCalled();
    });

    it('should show error', () => {
      fakeCompanyService.updateCompany.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(fakeCompanyService.updateCompany).toHaveBeenCalled();
    });
  });
});
