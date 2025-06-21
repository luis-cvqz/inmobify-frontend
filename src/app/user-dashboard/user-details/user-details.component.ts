import { Component, inject, EventEmitter, Output } from "@angular/core";
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
  };
  @Output() edit = new EventEmitter<any>();

  constructor() {
    const user_id = localStorage.getItem("user_uuid");

    if (!user_id) {
      console.error("User ID not found");
      return;
    }

    this.usersService.fetchUser(user_id).then((user: UserNoPass) => {
      this.user = user;
    });
  }

  onEdit() {
    this.edit.emit();
  }
}
