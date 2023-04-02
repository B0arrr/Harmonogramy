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
  title?: string;
  user?: string | null;

  constructor(private accountService: AccountService) {
    this.accountService.token.subscribe((x) => (this.token = x));
    this.title = environment.title;
    this.accountService.user.subscribe(
      (x) => (this.user = x?.first_name?.toString())
    );
  }

  logout(): void {
    this.accountService.logout();
  }
}
