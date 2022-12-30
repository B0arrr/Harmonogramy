import { AccountService } from '../../../services/account.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(private router: Router, private accountService: AccountService) {
    if (this.accountService.tokenValue) {
      this.router.navigate(['/']);
    }
  }
}
