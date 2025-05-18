import { Component, EventEmitter, Output } from "@angular/core";
import { PropertiesService } from "../../services/properties.service";
import { PropertyPreview } from "../../models/property-preview";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-posts-summary",
  imports: [CommonModule, RouterModule],
  templateUrl: "./posts-summary.component.html",
})
export class PostsSummaryComponent {
  properties: PropertyPreview[] = [];
  userId = localStorage.getItem("user_uuid")!;
  @Output() boost = new EventEmitter<any>();

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

  onBoost(propertyId: any) {
    this.boost.emit(propertyId);
  }

  onEdit(property_id: any) {
    this.router.navigate(["/update-property", property_id]);
  }

  async onDelete(property_id: string) {
    const confirmation = confirm(
      "¿Estás seguro de que quieres eliminar esta propiedad?",
    );
    if (!confirmation) return;

    try {
      await this.propertiesService.deleteProperty(property_id);
      await this.propertiesService.deletePropertyImagesDirectory(property_id);
      await this.propertiesService.deleteAllPropertyImages(property_id);
      await Swal.fire({
        icon: "success",
        text: "Publicación eliminada correctamente",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
      const index = this.properties.findIndex((p) => p.id === property_id);
      if (index !== -1) {
        this.properties.splice(index, 1);
      }
    } catch {
      await Swal.fire({
        icon: "error",
        text: "No se pudo eliminar la propiedad, inténtalo de nuevo más tarde",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
    }
  }
}
