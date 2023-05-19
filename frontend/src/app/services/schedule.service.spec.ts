import { TestBed } from '@angular/core/testing';

import { ScheduleService } from './schedule.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

const createSpyObj = jasmine.createSpyObj;

describe('ScheduleService', () => {
  let service: ScheduleService;
  let date: Date;

  const fakeHttpClient = createSpyObj('HttpClient', [
    'post',
    'get',
    'put',
    'delete'
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: fakeHttpClient
        }
      ]
    });

    date = new Date();

    service = TestBed.inject(ScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createSchedule', () => {
    it('should create schedule', () => {
      fakeHttpClient.post.and.returnValue(
        of({
          id: 1,
          start_day: date,
          day_off: false
        })
      );
      service.createSchedule('').subscribe((x) => {
        expect(x).toEqual({
          id: 1,
          start_day: date,
          day_off: false
        });
      });
    });
  });

  describe('getScheduleId', () => {
    it('should get schedule id', () => {
      fakeHttpClient.get.and.returnValue(of(1));
      service.getScheduleId('').subscribe((x) => {
        expect(x).toEqual(1);
      });
    });
  });
});
