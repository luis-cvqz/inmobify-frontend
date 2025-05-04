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
  userId = localStorage.getItem("user_uuid")!;

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

  async onDelete(property_id: string) {
    const confirmation = confirm(
      "¿Estás seguro de que quieres eliminar esta propiedad?",
    );
    if (!confirmation) return;

    await this.propertiesService.deleteProperty(property_id);
    await this.propertiesService.deletePropertyImagesDirectory(property_id);

    const index = this.properties.findIndex((p) => p.id === property_id);
    if (index !== -1) {
      this.properties.splice(index, 1);
    }
  }
}
