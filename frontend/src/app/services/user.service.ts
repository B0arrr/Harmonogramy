import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  activateUser(id: number): void {
    this.http
      .put<User>(`${environment.apiUrl}/user/activate_user/${id}`, {})
      .subscribe();
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(
      `${environment.apiUrl}/user/get_user_by_id/${id}`
    );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/user/get_all_users`);
  }

  getAllUsersFromCompanyById(id: number): Observable<User[]> {
    return this.http.get<User[]>(
      `${environment.apiUrl}/user/get_all_users_from_company_by_id/${id}`
    );
  }

  updateUser(params: any): Observable<User> {
    return this.http.put<User>(
      `${environment.apiUrl}/user/update_user_by_id/${params.id}`,
      params
    );
  }
}
