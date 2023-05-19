import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleComponent } from './schedule.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {
  DxDraggableModule,
  DxSchedulerModule,
  DxScrollViewModule
} from 'devextreme-angular';
import createSpyObj = jasmine.createSpyObj;
import { UserService } from '../../services/user.service';
import { EmploymentService } from '../../services/employment.service';
import { of, throwError } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { AccountService } from '../../services/account.service';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleUserService } from '../../services/scheduleuser.service';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;
  let date: Date;
  let e: any;
  let appointments = [];

  const fakeAccountService = createSpyObj('AccountService', ['']);
  const fakeUserService = createSpyObj('UserService', [
    'getAllUsersFromCompanyById'
  ]);
  const fakeEmploymentService = createSpyObj('EmploymentService', [
    'getAllEmployments'
  ]);
  const fakeAlertService = createSpyObj('AlertService', ['clear', 'error']);
  const fakeScheduleService = createSpyObj('ScheduleService', [
    'getScheduleId',
    'createSchedule'
  ]);
  const fakeScheduleUserService = createSpyObj('ScheduleUserService', [
    'createScheduleUser',
    'updateScheduleUser',
    'deleteScheduleUser',
    'getUserSchedules'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleComponent],
      imports: [
        TranslateModule.forRoot(),
        DxSchedulerModule,
        DxScrollViewModule,
        DxDraggableModule
      ],
      providers: [
        HttpClient,
        HttpHandler,
        DatePipe,
        {
          provide: UserService,
          useValue: fakeUserService
        },
        {
          provide: AccountService,
          useValue: fakeAccountService
        },
        {
          provide: EmploymentService,
          useValue: fakeEmploymentService
        },
        {
          provide: AlertService,
          useValue: fakeAlertService
        },
        {
          provide: ScheduleService,
          useValue: fakeScheduleService
        },
        {
          provide: ScheduleUserService,
          useValue: fakeScheduleUserService
        }
      ]
    }).compileComponents();

    date = new Date();

    fakeUserService.getAllUsersFromCompanyById.and.returnValue(of([]));
    fakeEmploymentService.getAllEmployments.and.returnValue(of([]));
    fakeAccountService.userValue = {
      id: 3,
      is_superuser: true,
      position_id: 1,
      employment_id: 1
    };

    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.appointments = [
      {
        id: 1,
        text: '',
        startDate: date,
        endDate: date
      },
      {
        id: 2,
        text: '',
        startDate: date,
        endDate: date
      }
    ];

    component.employments = [
      {
        id: 1,
        max_hours_per_day: 8,
        max_hours_per_week: 40
      }
    ];

    component.users = [{ id: 1 }, { id: 2 }, { id: 3, employment_id: 1 }];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAppointmentRemove', () => {
    beforeEach(() => {
      e = {
        itemData: component.appointments?.find((x) => (x.id = 1))
      };
    });

    it('should remove appointment', () => {
      component.onAppointmentRemove(e);
      expect(component.appointments?.length).toEqual(1);
      expect(component.deleted_appointments?.length).toEqual(1);
    });

    it('should not remove appointment when index is not greater or equal 0', () => {
      e.itemData = {};
      component.onAppointmentRemove(e);
      expect(component.appointments?.length).toEqual(2);
      expect(component.deleted_appointments?.length).toEqual(0);
    });
  });

  describe('onAppointmentAdd', () => {
    beforeEach(() => {
      component.usersList = [{ id: 1 }];
      e = {
        itemData: {
          id: 3,
          text: '',
          startDate: date,
          endDate: date
        },
        fromData: component.usersList.find((x: any) => (x.id = 1))
      };
    });

    it('should add appointment', () => {
      component.onAppointmentAdd(e);
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(component.appointments?.length).toEqual(3);
    });

    it('should not add appointment when user is null', () => {
      component.users = [];
      component.onAppointmentRemove(e);
      expect(component.appointments?.length).toEqual(2);
    });

    it('should not add appointment when current user is null', () => {
      fakeAccountService.userValue = null;
      component.onAppointmentRemove(e);
      expect(component.appointments?.length).toEqual(2);
    });

    it("should not add appointment when current user don't have permissions", () => {
      fakeAccountService.userValue = {
        id: 3,
        is_superuser: false,
        position_id: 1,
        employment_id: 1
      };
      component.onAppointmentRemove(e);
      expect(component.appointments?.length).toEqual(2);
    });

    it('should not add appointment when employment is undefined', () => {
      component.employments = [];
      component.onAppointmentRemove(e);
      expect(component.appointments?.length).toEqual(2);
    });

    it('should not add appointment when working time exceeded', () => {
      spyOn<any>(component, 'calculateTimeInWeek').and.returnValue(100);
      component.onAppointmentRemove(e);
      expect(component.appointments?.length).toEqual(2);
    });

    it('should not add appointment when index is not greater or equal 0', () => {
      e.fromData = [];
      component.onAppointmentRemove(e);
      expect(component.appointments?.length).toEqual(2);
    });
  });

  describe('onAppointmentUpdating', () => {
    beforeEach(() => {
      const date2 = new Date(1999, 1, 1, 0, 0, 0, 0);
      e = {
        oldData: {
          id: 3,
          text: '',
          startDate: date,
          endDate: date
        },
        newData: {
          id: 3,
          text: '',
          startDate: date,
          endDate: date2
        },
        cancel: false
      };
      component.appointments?.forEach((appointment) =>
        appointments.push(appointment)
      );
    });

    it('should update appointment', () => {
      component.onAppointmentUpdating(e);
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(e.cancel).toBeFalse();
    });

    it('should not update appointment when employment is undefined', () => {
      component.employments = [];
      component.onAppointmentUpdating(e);
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(e.cancel).toBeTrue();
    });

    it('should not update appointment when working time exceeded', () => {
      spyOn<any>(component, 'calculateTimeInWeek').and.returnValue(100);
      component.onAppointmentUpdating(e);
      expect(fakeAlertService.clear).toHaveBeenCalled();
      expect(fakeAlertService.error).toHaveBeenCalled();
      expect(e.cancel).toBeTrue();
    });
  });

  describe('save', () => {
    beforeEach(() => {
      component.deleted_appointments = [
        {
          id: 3,
          text: 'test',
          startDate: date,
          endDate: date,
          schedule_user_id: 1
        }
      ];
      fakeScheduleService.getScheduleId.calls.reset();
      fakeScheduleService.createSchedule.calls.reset();
      fakeScheduleUserService.createScheduleUser.calls.reset();
      fakeScheduleUserService.updateScheduleUser.calls.reset();
      fakeScheduleUserService.deleteScheduleUser.calls.reset();
    });

    it('should get schedule and save', () => {
      component.appointments = [
        {
          id: 1,
          text: '',
          startDate: date,
          endDate: date,
          schedule_user_id: 1
        },
        {
          id: 2,
          text: '',
          startDate: date,
          endDate: date
        }
      ];
      fakeScheduleService.getScheduleId.and.returnValue(of(1));
      fakeScheduleUserService.createScheduleUser.and.returnValue(of({ id: 1 }));
      fakeScheduleUserService.updateScheduleUser.and.returnValue(of({}));
      fakeScheduleUserService.deleteScheduleUser.and.returnValue(of({}));
      component.save();
      expect(fakeScheduleService.getScheduleId).toHaveBeenCalledTimes(2);
      expect(fakeScheduleUserService.createScheduleUser).toHaveBeenCalledTimes(
        1
      );
      expect(fakeScheduleUserService.updateScheduleUser).toHaveBeenCalledTimes(
        1
      );
      expect(fakeScheduleUserService.deleteScheduleUser).toHaveBeenCalledTimes(
        1
      );
      expect(component.deleted_appointments).toEqual([]);
    });

    it('should create schedule and save', () => {
      component.appointments = [
        {
          id: 1,
          text: '',
          startDate: date,
          endDate: date,
          schedule_user_id: 1
        },
        {
          id: 2,
          text: '',
          startDate: date,
          endDate: date
        }
      ];
      fakeScheduleService.getScheduleId.and.returnValue(throwError(''));
      fakeScheduleService.createSchedule.and.returnValue(of({}));
      fakeScheduleUserService.createScheduleUser.and.returnValue(of({ id: 2 }));
      fakeScheduleUserService.updateScheduleUser.and.returnValue(of({}));
      fakeScheduleUserService.deleteScheduleUser.and.returnValue(of({}));
      component.save();
      expect(fakeScheduleService.getScheduleId).toHaveBeenCalledTimes(2);
      expect(fakeScheduleService.createSchedule).toHaveBeenCalledTimes(2);
      expect(fakeScheduleUserService.createScheduleUser).toHaveBeenCalledTimes(
        1
      );
      expect(fakeScheduleUserService.updateScheduleUser).toHaveBeenCalledTimes(
        1
      );
      expect(fakeScheduleUserService.deleteScheduleUser).toHaveBeenCalledTimes(
        1
      );
      expect(component.deleted_appointments).toEqual([]);
    });
  });

  describe('load', () => {
    it('should load', () => {
      component.users = [{ id: 1 }, {}];
      component.appointments = [];
      fakeScheduleUserService.getUserSchedules.and.returnValue(
        of([
          {
            id: 1,
            schedule_id: 1,
            user_id: 1,
            shift_start: new Date(),
            shift_end: new Date()
          }
        ])
      );
      component.load();
      expect(component.appointments.length).toEqual(1);
    });
  });
});
