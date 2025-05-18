import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserDetailsComponent } from "../user-details/user-details.component";
import { RequestsSummaryComponent } from "../requests-summary/requests-summary.component";
import { RouterModule } from "@angular/router";
import { PostsSummaryComponent } from "../posts-summary/posts-summary.component";
import {
  Step,
  StoryboardCardComponent,
} from "../storyboard-card/storyboard-card.component"; // Adjust the path
import { BoostStep1Component } from "../storyboard-card/boost-step-1/boost-step-1.component";
import { BoostStep2Component } from "../storyboard-card/boost-step-2/boost-step-2.component";

@Component({
  selector: "app-dashboard",
  imports: [
    CommonModule,
    UserDetailsComponent,
    RequestsSummaryComponent,
    PostsSummaryComponent,
    StoryboardCardComponent,
    RouterModule,
  ],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  showBoostStoryboard: boolean = false;
  boostSteps: Step[] = [
    { component: BoostStep1Component },
    { component: BoostStep2Component },
  ];
  currentBoostedProperty: any;

  handleBoostClick(property: any): void {
    this.currentBoostedProperty = property;
    this.showBoostStoryboard = true;
  }

  closeBoostStoryboard(): void {
    this.showBoostStoryboard = false;
    this.currentBoostedProperty = null;
  }

  onBoostStoryboardFinished(): void {
    // call endpoint
    this.closeBoostStoryboard();
    // alert for success or else
  }
}
