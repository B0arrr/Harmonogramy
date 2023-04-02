import { Company } from '../../../models/company';
import { CompanyService } from '../../../services/company.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-company',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent {
  companies?: Company[] | null;
  constructor(private companyService: CompanyService) {
    this.companyService
      .getAllCompanies()
      .subscribe((companies) => (this.companies = companies));
  }
}
