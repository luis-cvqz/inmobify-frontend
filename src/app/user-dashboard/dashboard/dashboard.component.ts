import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserDetailsComponent } from "../user-details/user-details.component";
import { RequestsSummaryComponent } from "../requests-summary/requests-summary.component";

@Component({
  selector: "app-dashboard",
  imports: [CommonModule, UserDetailsComponent, RequestsSummaryComponent],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.css",
})
export class DashboardComponent {}
