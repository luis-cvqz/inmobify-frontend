import { Component } from "@angular/core";
import { PropertiesService } from "../../services/properties.service";
import { PropertyPreview } from "../../models/property-preview";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-posts-summary",
  imports: [CommonModule, RouterModule],
  templateUrl: "./posts-summary.component.html",
  styleUrl: "./posts-summary.component.css",
})
export class PostsSummaryComponent {
  properties: PropertyPreview[] = [];
  userId = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
  // userId = localStorage.getItem("user_uuid")!;

  constructor(
    private propertiesService: PropertiesService,
    private router: Router,
  ) {}

  async ngOnInit() {
    try {
      this.properties = await this.propertiesService.getUserPropertiesPreview(
        this.userId,
      );
    } catch (err) {
      console.error(err);
    }
  }

  onSeeProperty(propertyId: string) {
    this.router.navigate(["/property-detail", propertyId]);
  }

  onBoost(property: any) {
    console.log("Boost clicked:", property);
    // call boost API
  }

  onEdit(property: any) {
    console.log("Edit clicked:", property);
    // navigate to edit page or open modal
  }

  onDelete(property: any) {
    console.log("Delete clicked:", property);
    // confirm and call delete API
  }
}
