import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Position } from '../models/position';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  constructor(private http: HttpClient) {}

  addPosition(params: any): Observable<Position> {
    return this.http.post<Position>(
      `${environment.apiUrl}/position/create_position`,
      params
    );
  }

  getAllPositions(): Observable<Position[]> {
    return this.http.get<Position[]>(
      `${environment.apiUrl}/position/get_all_positions`
    );
  }

  updatePosition(id: number, position: string): Observable<Position> {
    return this.http.put<Position>(
      `${environment.apiUrl}/position/update_position_by_id/${id}/position/${position}`,
      {}
    );
  }
}
