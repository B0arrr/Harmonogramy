import { Company } from '../models/company';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private router: Router, private http: HttpClient) {}

  addCompany(params: any): Observable<Company> {
    return this.http.post<Company>(
      `${environment.apiUrl}/company/create_company`,
      params
    );
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(
      `${environment.apiUrl}/company/get_company_by_id/${id}`
    );
  }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(
      `${environment.apiUrl}/company/get_all_companies`
    );
  }

  updateCompany(id: number, company: string): Observable<Company> {
    return this.http.put<Company>(
      `${environment.apiUrl}/company/update_company_by_id/${id}/company/${company}`,
      {}
    );
  }
}
