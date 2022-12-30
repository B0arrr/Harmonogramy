import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';
import { AlertService } from '../../services/alert.service';
import createSpyObj = jasmine.createSpyObj;
import { of, Subscription } from 'rxjs';
import { AlertType } from '../../models/alert';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  const fakeAlertService = createSpyObj('AlertService', ['onAlert']);

  beforeEach(async () => {
    fakeAlertService.onAlert.and.returnValue(
      of({
        id: '1',
        type: AlertType.Info,
        message: 'asd',
        autoClose: false,
        keepAfterRouteChange: false,
        fade: false
      })
    );

    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [
        {
          provide: AlertService,
          useValue: fakeAlertService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should setup component on init', () => {
      component.ngOnInit();
      fakeAlertService.onAlert.and.returnValue(
        of({
          id: 1,
          type: AlertType.Info,
          message: 'test',
          autoClose: false,
          keepAfterRouteChange: false,
          fade: false
        })
      );
      expect(component.alerts.length).toBeGreaterThan(0);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe everything', () => {
      spyOn(Subscription.prototype, 'unsubscribe');
      component.ngOnDestroy();
      expect(Subscription.prototype.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('removeAlert', () => {
    it('should remove alert', () => {
      const alert = component.alerts[0];
      component.removeAlert(alert);
      expect(component.alerts).not.toContain(alert);
    });
  });

  describe('cssClass', () => {
    it('should return css string', () => {
      const alert = component.alerts[0];
      const cssString = component.cssClass(alert);
      expect(cssString).toEqual(
        'alert alert-dismissible pt-4 container alert-info'
      );
    });
  });
});
