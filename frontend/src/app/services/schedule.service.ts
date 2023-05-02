import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from '../interfaces/schedule';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  createSchedule(date: string): Observable<Schedule> {
    return this.http.post<Schedule>(
      `${environment.apiUrl}/schedule/create_schedule`,
      {
        start_day: date,
        day_off: false
      }
    );
  }
  getScheduleId(date: string): Observable<number> {
    return this.http.get<number>(
      `${environment.apiUrl}/schedule/get_schedule_id/${date}`
    );
  }
}
