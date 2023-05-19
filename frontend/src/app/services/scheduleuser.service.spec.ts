import { TestBed } from '@angular/core/testing';

import { ScheduleUserService } from './scheduleuser.service';
import { HttpClient } from '@angular/common/http';
import createSpyObj = jasmine.createSpyObj;
import { of } from 'rxjs';

describe('ScheduleUserService', () => {
  let service: ScheduleUserService;
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

    service = TestBed.inject(ScheduleUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createScheduleUser', () => {
    it('should create schedule user', () => {
      fakeHttpClient.post.and.returnValue(
        of({
          id: 1,
          schedule_id: 1,
          user_id: 1,
          shift_start: date,
          shift_end: date
        })
      );
      service
        .createScheduleUser(1, 2, new Date(), new Date())
        .subscribe((x) => {
          expect(x).toEqual({
            id: 1,
            schedule_id: 1,
            user_id: 1,
            shift_start: date,
            shift_end: date
          });
        });
    });
  });

  describe('getUserSchedules', () => {
    it('should get schedule user', () => {
      fakeHttpClient.get.and.returnValue(of([]));
      service.getUserSchedules(1).subscribe((x) => {
        expect(x).toEqual([]);
      });
    });
  });

  describe('updateScheduleUser', () => {
    it('should update schedule user', () => {
      fakeHttpClient.put.and.returnValue(
        of({
          id: 1,
          schedule_id: 1,
          user_id: 1,
          shift_start: date,
          shift_end: date
        })
      );
      service
        .updateScheduleUser(1, 1, 2, new Date(), new Date())
        .subscribe((x) => {
          expect(x).toEqual({
            id: 1,
            schedule_id: 1,
            user_id: 1,
            shift_start: date,
            shift_end: date
          });
        });
    });
  });

  describe('deleteScheduleUser', () => {
    it('should delete schedule user', () => {
      fakeHttpClient.delete.and.returnValue(
        of({
          id: 1,
          schedule_id: 1,
          user_id: 1,
          shift_start: date,
          shift_end: date
        })
      );
      service.deleteScheduleUser(1).subscribe((x) => {
        expect(x).toEqual({
          id: 1,
          schedule_id: 1,
          user_id: 1,
          shift_start: date,
          shift_end: date
        });
      });
    });
  });
});
