import { AccountService } from '../../../services/account.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users?: User[] | null;
  constructor(
    private userService: UserService,
    private accountService: AccountService,
    private router: Router
  ) {}
  ngOnInit() {
    this.accountService.user.subscribe((user) => {
      if (user?.position_id == 1 && !user?.is_superuser) {
        this.userService
          .getAllUsers()
          .subscribe(
            (users) =>
              (this.users = users.filter(
                (x) => x.company_id === user.company_id
              ))
          );
      } else {
        this.userService
          .getAllUsers()
          .subscribe((users) => (this.users = users));
      }
    });
  }
  activate(id: number | undefined): void {
    if (id == undefined) return;

    this.userService.activateUser(id);
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
