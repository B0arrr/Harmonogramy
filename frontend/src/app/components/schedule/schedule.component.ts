import { loadMessages, locale } from 'devextreme/localization';
import { AccountService } from '../../services/account.service';
import { AlertService } from '../../services/alert.service';
import { Appointment } from '../../interfaces/appointment';
import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Employment } from '../../models/employment';
import { EmploymentService } from '../../services/employment.service';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleUserService } from '../../services/scheduleuser.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import enMessages from 'devextreme/localization/messages/en.json';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  company: number = 0;
  draggingGroupName: string = 'usersGroup';
  users: User[] | null = [];
  employments: Employment[] | null = [];
  usersList: any = [];
  appointments: Appointment[] | null = [];
  deleted_appointments: Appointment[] | null = [];
  currentDate: Date = new Date();
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  constructor(
    private userService: UserService,
    private employmentService: EmploymentService,
    private alertService: AlertService,
    private datePipe: DatePipe,
    private scheduleService: ScheduleService,
    private scheduleUserService: ScheduleUserService,
    private accountService: AccountService,
    private translate: TranslateService
  ) {
    const company = localStorage.getItem('company');
    if (company != null) {
      this.company = parseInt(company);
    }
    this.userService
      .getAllUsersFromCompanyById(this.company)
      .subscribe((users) => {
        this.users = users;
        users.forEach((user) => {
          this.usersList?.push({
            id: user.id,
            text: `${user.first_name} ${user.last_name}`
          });
        });
        this.load();
      });
    this.employmentService.getAllEmployments().subscribe((employments) => {
      this.employments = employments;
    });
    this.onAppointmentRemove = this.onAppointmentRemove.bind(this);
    this.onAppointmentAdd = this.onAppointmentAdd.bind(this);
    this.initMessages();
    locale(this.getLocale());
  }

  onAppointmentRemove(e: any): void {
    this.alertService.clear();
    const index = this.appointments?.indexOf(e.itemData);
    if (index == undefined) return;
    if (index >= 0) {
      this.appointments?.splice(index, 1);
      this.deleted_appointments?.push(e.itemData);
    }
  }

  onAppointmentAdd(e: any): void {
    this.alertService.clear();
    const currUser = this.accountService.userValue;
    const user = this.users?.find((user) => user.id == e.itemData.id);
    if (!currUser || !user) return;
    if (
      !currUser.is_superuser &&
      currUser.position_id != 1 &&
      currUser.id !== user.id
    ) {
      e.cancel = true;
      return;
    }
    const employment = this.employments?.find(
      (employment) => employment.id == user?.employment_id
    );
    const hoursInWeek = this.calculateTimeInWeek(e.itemData, {});
    const hoursInDay = this.calculateTimeInDay(e.itemData, {});

    if (
      employment == undefined ||
      employment.max_hours_per_week == undefined ||
      employment.max_hours_per_day == undefined
    )
      return;
    if (
      hoursInDay >= employment.max_hours_per_day ||
      hoursInWeek >= employment.max_hours_per_week
    ) {
      e.cancel = true;
      this.alertService.clear();
      this.alertService.error(this.translate.instant('ALERT.ERROR.TIME'));
      return;
    }

    const index = this.usersList.indexOf(e.fromData);
    if (index == undefined) return;
    if (index >= 0) {
      this.appointments?.push(e.itemData);
    }
  }

  onListDragStart(e: any): void {
    e.cancel = true;
  }

  onItemDragStart(e: any): void {
    e.itemData = e.fromData;
  }

  onItemDragEnd(e: any): void {
    if (e.toData) {
      e.cancel = true;
    }
  }

  onAppointmentFormOpening(e: any): void {
    if (e.appointmentData.id == undefined) {
      e.cancel = true;
    }
  }

  onAppointmentUpdating(e: any): void {
    this.alertService.clear();
    const user = this.users?.find((user) => user.id == e.newData.id);
    const employment = this.employments?.find(
      (employment) => employment.id == user?.employment_id
    );

    const hoursInWeek = this.calculateTimeInWeek(e.newData, e.oldData, true);
    const hoursInDay = this.calculateTimeInDay(e.newData, e.oldData, true);

    if (
      employment == undefined ||
      employment.max_hours_per_day == undefined ||
      employment.max_hours_per_week == undefined
    ) {
      e.cancel = true;
      return;
    }
    if (
      hoursInDay > employment.max_hours_per_day ||
      hoursInWeek > employment.max_hours_per_week
    ) {
      e.cancel = true;
      this.alertService.error(this.translate.instant('ALERT.ERROR.TIME'));
    }
  }

  save(): void {
    this.appointments?.forEach((appointment) => {
      const startDate = new Date(new Date(appointment.startDate).toISOString());
      const endDate = new Date(new Date(appointment.endDate).toISOString());
      const date = this.datePipe.transform(appointment.startDate, 'yyyy-MM-dd');
      if (!date) return;
      this.scheduleService.getScheduleId(date).subscribe(
        (x) => {
          if (!appointment.schedule_user_id) {
            this.scheduleUserService
              .createScheduleUser(appointment.id, x, startDate, endDate)
              .subscribe((y) => (appointment.schedule_user_id = y.id));
            return;
          }
          this.scheduleUserService
            .updateScheduleUser(
              appointment.schedule_user_id,
              appointment.id,
              x,
              startDate,
              endDate
            )
            .subscribe();
        },
        () => {
          this.scheduleService.createSchedule(date).subscribe((x) => {
            if (!appointment.schedule_user_id) {
              this.scheduleUserService
                .createScheduleUser(appointment.id, x.id, startDate, endDate)
                .subscribe((y) => (appointment.schedule_user_id = y.id));
              return;
            }
            this.scheduleUserService
              .updateScheduleUser(
                appointment.schedule_user_id,
                appointment.id,
                x.id,
                startDate,
                endDate
              )
              .subscribe();
          });
        }
      );
    });
    this.deleted_appointments?.forEach((appointment) => {
      if (!appointment.schedule_user_id) return;
      this.scheduleUserService
        .deleteScheduleUser(appointment.schedule_user_id)
        .subscribe();
    });
    this.deleted_appointments = [];
  }

  load(): void {
    const offset = -(new Date().getTimezoneOffset() / 60);
    this.users?.forEach((user) => {
      if (user && user.id) {
        this.scheduleUserService
          .getUserSchedules(user.id)
          .subscribe((user_schedules) => {
            user_schedules.forEach((y) => {
              const id = user.id;
              if (!id) return;
              const shift_start = new Date(
                new Date(y.shift_start).setHours(
                  new Date(y.shift_start).getHours() + offset
                )
              );
              const shift_end = new Date(
                new Date(y.shift_end).setHours(
                  new Date(y.shift_end).getHours() + offset
                )
              );
              this.appointments?.push({
                id: id,
                schedule_user_id: y.id,
                text: `${user.first_name} ${user.last_name}`,
                startDate: shift_start,
                endDate: shift_end
              });
            });
          });
      }
    });
  }

  private calculateTimeInWeek(
    newData: any,
    oldData: any,
    isUpdated: boolean = false
  ): number {
    let hoursInWeek = 0;
    const userInWeek = this.appointments?.filter((appointment) => {
      if (appointment.id == newData.id) {
        const data = newData.startDate;
        const year = this.datePipe.transform(data, 'y');
        const weekInYear = this.datePipe.transform(data, 'w');
        const appointmentData = appointment.startDate;
        const appointmentYear = this.datePipe.transform(appointmentData, 'y');
        const appointmentWeekInYear = this.datePipe.transform(
          appointmentData,
          'w'
        );
        return year == appointmentYear && weekInYear == appointmentWeekInYear;
      }
      return false;
    });
    userInWeek?.forEach((appointment) => {
      hoursInWeek +=
        (+appointment.endDate - +appointment.startDate) / (3600 * 1000);
    });
    if (isUpdated) {
      hoursInWeek +=
        (newData.endDate - newData.startDate) / (3600 * 1000) -
        (oldData.endDate - oldData.startDate) / (3600 * 1000);
      return hoursInWeek;
    }
    return hoursInWeek;
  }

  private calculateTimeInDay(
    newData: any,
    oldData: any,
    isUpdated: boolean = false
  ): number {
    let hoursInDay = 0;
    const userInDay = this.appointments?.filter((appointment) => {
      const data = newData.startDate;
      const year = this.datePipe.transform(data, 'y');
      const weekInYear = this.datePipe.transform(data, 'w');
      const dayInWeek = this.datePipe.transform(data, 'c');
      const appointmentData = appointment.startDate;
      const appointmentYear = this.datePipe.transform(appointmentData, 'y');
      const appointmentWeekInYear = this.datePipe.transform(
        appointmentData,
        'w'
      );
      const appointmentDayInWeek = this.datePipe.transform(
        appointmentData,
        'c'
      );
      return (
        year == appointmentYear &&
        weekInYear == appointmentWeekInYear &&
        dayInWeek == appointmentDayInWeek
      );
    });
    userInDay?.forEach((appointment) => {
      hoursInDay +=
        (+appointment.endDate - +appointment.startDate) / (3600 * 1000);
    });
    if (isUpdated) {
      hoursInDay +=
        (newData.endDate - newData.startDate) / (3600 * 1000) -
        (oldData.endDate - oldData.startDate) / (3600 * 1000);
      return hoursInDay;
    }
    return hoursInDay;
  }

  private getLocale(): string {
    const locale = localStorage.getItem('locale');
    return locale != null ? locale : 'en';
  }

  private initMessages(): void {
    loadMessages(enMessages);
  }
}
