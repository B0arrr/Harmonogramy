import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ScheduleUser } from '../interfaces/scheduleuser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleUserService {
  constructor(private http: HttpClient) {}

  createScheduleUser(
    user_id: number,
    schedule_id: number,
    shift_start: Date,
    shift_end: Date
  ): Observable<ScheduleUser> {
    return this.http.post<ScheduleUser>(
      `${environment.apiUrl}/schedule_user/create_schedule_user`,
      {
        user_id,
        schedule_id,
        shift_start,
        shift_end
      }
    );
  }

  getUserSchedules(user_id: number): Observable<ScheduleUser[]> {
    return this.http.get<ScheduleUser[]>(
      `${environment.apiUrl}/schedule_user/get_all_schedules_for_user/${user_id}`
    );
  }

  updateScheduleUser(
    id: number,
    user_id: number,
    schedule_id: number,
    shift_start: Date,
    shift_end: Date
  ): Observable<ScheduleUser> {
    return this.http.put<ScheduleUser>(
      `${environment.apiUrl}/schedule_user/update_schedule_for_user_by_id/${id}`,
      {
        user_id,
        schedule_id,
        shift_start,
        shift_end
      }
    );
  }

  deleteScheduleUser(id: number): Observable<ScheduleUser> {
    return this.http.delete<ScheduleUser>(
      `${environment.apiUrl}/schedule_user/delete_schedule_user_by_id/${id}`
    );
  }
}
