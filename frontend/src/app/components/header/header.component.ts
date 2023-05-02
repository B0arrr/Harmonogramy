import { AccountService } from '../../services/account.service';
import { CompanyService } from '../../services/company.service';
import { Component } from '@angular/core';
import { Token } from '../../models/token';
import { User } from '../../models/user';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  token?: Token | null;
  title?: string;
  user?: User | null;
  company?: string | null;

  constructor(
    private accountService: AccountService,
    private companyService: CompanyService
  ) {
    this.accountService.token.subscribe((x) => (this.token = x));
    this.title = environment.title;
    this.accountService.user.subscribe((x) => {
      this.user = x;
    });
    if (!this.user?.company_id) return;
    this.companyService
      .getCompanyName(this.user?.company_id)
      .subscribe((x) => (this.company = x));
  }

  logout(): void {
    this.accountService.logout();
  }
}
