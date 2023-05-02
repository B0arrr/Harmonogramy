import { BehaviorSubject, Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from '../models/token';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private tokenSubject: BehaviorSubject<Token | null>;
  public token: Observable<Token | null>;
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private router: Router, private http: HttpClient) {
    this.tokenSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('token')!)
    );
    this.token = this.tokenSubject.asObservable();
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }

  public get tokenValue(): Token | null {
    return this.tokenSubject.value;
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(username: string, password: string): Observable<Token> {
    const data = `username=${username}&password=${password}`;
    return this.http
      .post<Token>(`${environment.apiUrl}/login/access-token`, data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      })
      .pipe(
        map((token): Token => {
          localStorage.setItem('token', JSON.stringify(token));
          this.tokenSubject.next(token);
          this.http
            .post<User>(
              `${environment.apiUrl}/login/test-token`,
              {},
              {
                headers: new HttpHeaders({
                  Authorization: `Bearer ${token.access_token}`
                })
              }
            )
            .subscribe((user: User) => {
              localStorage.setItem('user', JSON.stringify(user));
              if (user.company_id) {
                localStorage.setItem('company', user.company_id.toString());
              }
              this.userSubject.next(user);
              return user;
            });
          return token;
        })
      );
  }

  checkPassword(params: any): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/check_password`, params);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/user/create_user`, user);
  }

  update(id: number, params: any): Observable<User> {
    return this.http
      .put(`${environment.apiUrl}/user/update_user_by_id/${id}`, params)
      .pipe(
        map((user: User) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  updatePassword(id: number, params: any): Observable<User> {
    return this.http
      .put(`${environment.apiUrl}/user/update_user_password/${id}`, params)
      .pipe(
        map((user: User) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  delete(id: number): Observable<User> {
    return this.http
      .delete(`${environment.apiUrl}/user/delete_user/${id}`)
      .pipe(
        map((x: User) => {
          if (id == this.userValue?.id) {
            this.logout();
          }
          return x;
        })
      );
  }
}
