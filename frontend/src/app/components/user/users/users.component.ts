import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';
import {AccountService} from "../../../services/account.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users?: User[] | null;
  constructor(private userService: UserService, private accountService: AccountService) {}
  ngOnInit() {
    this.accountService.user.subscribe((user) => {
      if (user?.position_id == 1 && !user?.is_superuser) {
        this.userService.getAllUsers().subscribe((users) => (this.users = users
          .filter((x) => x.company_id === user.company_id)));
      }
      else {
        this.userService.getAllUsers().subscribe((users) => (this.users = users));
      }
    });

  }
  activate(id: number | undefined): void {
    if (id == undefined) return;

    this.userService.activateUser(id);
    this.ngOnInit();
    this.ngOnInit();
  }
}
