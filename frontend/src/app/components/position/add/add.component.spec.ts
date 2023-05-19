import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComponent } from './add.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { AlertService } from '../../../services/alert.service';
import { PositionService } from '../../../services/position.service';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('AddPositionComponent', () => {
  let component: AddComponent;
  let fixture: ComponentFixture<AddComponent>;

  const fakeAlertService = createSpyObj('AlertService', [
    'success',
    'error',
    'clear'
  ]);
  const fakePositionService = createSpyObj('PositionService', ['addPosition']);

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
          provide: PositionService,
          useValue: fakePositionService
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
        position: new FormControl('test')
      });
    });

    it('should add position', () => {
      fakePositionService.addPosition.and.returnValue(of({}));
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.success).toHaveBeenCalled();
      expect(fakePositionService.addPosition).toHaveBeenCalled();
    });

    it('should show error', () => {
      fakePositionService.addPosition.and.returnValue(
        throwError(() => new Error('dsad'))
      );
      component.onSubmit();
      expect(component.submitted).toBeTrue();
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(fakePositionService.addPosition).toHaveBeenCalled();
    });
  });
});
