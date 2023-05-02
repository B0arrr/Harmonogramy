export interface Appointment {
  id: number;

  schedule_user_id?: number;

  text: string;

  startDate: Date;

  endDate: Date;

  allDay?: boolean;
}
