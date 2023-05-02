export interface ScheduleUser {
  id: number;
  schedule_id: number;
  user_id: number;
  shift_start: Date;
  shift_end: Date;
}
