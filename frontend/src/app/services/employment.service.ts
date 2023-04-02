import { Employment } from '../models/employment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmploymentService {
  constructor(private http: HttpClient) {}

  addEmployment(params: any): Observable<Employment> {
    return this.http.post<Employment>(
      `${environment.apiUrl}/employment/create_employment`,
      params
    );
  }

  getAllEmployments(): Observable<Employment[]> {
    return this.http.get<Employment[]>(
      `${environment.apiUrl}/employment/get_all_employments`
    );
  }

  updateEmployment(id: number, employment: string): Observable<Employment> {
    return this.http.put<Employment>(
      `${environment.apiUrl}/employment/update_employment_by_id/${id}/employment/${employment}`,
      {}
    );
  }
}
