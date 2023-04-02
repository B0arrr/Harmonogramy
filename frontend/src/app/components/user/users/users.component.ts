import { Component } from '@angular/core';
import { User } from '../../../models/user';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  users?: User[] | null;
  constructor(private userService: UserService) {}
  ngOnInit() {
    this.userService.getAllUsers().subscribe((users) => (this.users = users));
  }
  activate(id: number | undefined): void {
    if (id == undefined) return;

    this.userService.activateUser(id);
    this.ngOnInit();
    this.ngOnInit();
  }
}
