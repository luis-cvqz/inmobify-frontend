import { Component, inject } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { UserNoPass } from "../../models/user-no-pass";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-user-details",
  imports: [CommonModule],
  templateUrl: "./user-details.component.html",
  styleUrl: "./user-details.component.css",
})
export class UserDetailsComponent {
  usersService: UsersService = inject(UsersService);
  user: UserNoPass = {
    id: "",
    name: "",
    last_name: "",
    email: "",
    phone: "",
    created_at: "",
    user_type_id: 0,
  };

  constructor() {
    const user_id = localStorage.getItem("user_id") || "s";
    this.usersService.fetchUser(user_id).then((user: UserNoPass) => {
      this.user = user;
    });
  }
}
