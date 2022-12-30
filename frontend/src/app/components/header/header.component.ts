import { AccountService } from '../../services/account.service';
import { Component } from '@angular/core';
import { Token } from '../../models/token';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  token?: Token | null;
  tokenValue?: Token | null;
  title?: string;

  constructor(private accountService: AccountService) {
    this.accountService.token.subscribe((x) => (this.token = x));
    this.tokenValue = this.accountService.tokenValue;
    this.title = environment.title;
  }

  logout(): void {
    this.accountService.logout();
  }
}
