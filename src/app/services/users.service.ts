import { Injectable } from "@angular/core";
import { UserNoPass } from "../models/user-no-pass";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private url = "http://localhost:12005/user";

  constructor() {}

  async fetchUser(userId: string): Promise<UserNoPass> {
    const token = localStorage.getItem("jwt_token") || "";
    const response = await fetch(`${this.url}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);

    return await response.json();
  }
}
