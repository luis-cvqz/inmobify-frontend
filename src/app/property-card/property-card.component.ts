import { Component, Input } from "@angular/core";
import { PropertySummary } from "../models/property-summary";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-property-card",
  imports: [CommonModule, RouterModule],
  templateUrl: "./property-card.component.html",
  styleUrl: "./property-card.component.css",
})
export class PropertyCardComponent {
  constructor(private router: Router) {}

  @Input() propertySummary!: PropertySummary;

  navigateToDetail(propertySummary: PropertySummary) {
    this.router.navigate(["/property-detail"], {
      state: { propertyData: propertySummary },
    });
  }
}
