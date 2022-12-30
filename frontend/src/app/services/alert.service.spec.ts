import { TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';
import { Alert, AlertType } from '../models/alert';

describe('AlertService', () => {
  let service: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onAlert', () => {
    it('should filter alerts', () => {
      service.onAlert().subscribe((alert) => {
        expect(alert).not.toBeNull();
      });
      service.success('test');
    });
  });

  describe('success', () => {
    it('should create success alert', () => {
      service.onAlert().subscribe((alert) => {
        expect(alert.id).toEqual('default-alert');
        expect(alert.message).toEqual('test');
        expect(alert.type).toEqual(AlertType.Success);
      });
      service.success('test');
    });
  });

  describe('error', () => {
    it('should create error alert', () => {
      service.onAlert().subscribe((alert) => {
        expect(alert.id).toEqual('default-alert');
        expect(alert.message).toEqual('test');
        expect(alert.type).toEqual(AlertType.Error);
      });
      service.error('test');
    });
  });

  describe('info', () => {
    it('should create info alert', () => {
      service.onAlert().subscribe((alert) => {
        expect(alert.id).toEqual('default-alert');
        expect(alert.message).toEqual('test');
        expect(alert.type).toEqual(AlertType.Info);
      });
      service.info('test');
    });
  });

  describe('warn', () => {
    it('should create warning alert', () => {
      service.onAlert().subscribe((alert) => {
        expect(alert.id).toEqual('default-alert');
        expect(alert.message).toEqual('test');
        expect(alert.type).toEqual(AlertType.Warning);
      });
      service.warn('test');
    });
  });

  describe('alert', () => {
    it('should create alert', () => {
      service.onAlert().subscribe((alert) => {
        expect(alert.id).toEqual('default-alert');
        expect(alert.message).toEqual('test');
        expect(alert.type).toEqual(AlertType.Success);
      });
      service.alert(new Alert({ type: AlertType.Success, message: 'test' }));
    });
  });

  describe('clear', () => {
    it('should create clear alerts', () => {
      service.onAlert().subscribe((alert) => {
        expect(alert.id).toEqual('default-alert');
      });
      service.clear();
    });
  });
});
