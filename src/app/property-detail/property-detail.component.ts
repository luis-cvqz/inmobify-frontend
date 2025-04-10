import { CommonModule } from "@angular/common";
import { PropertySummary } from "../models/property-summary";
import { Component, inject, Input, OnInit } from "@angular/core";
import { PropertiesService } from "../services/properties.service";
import { PropertyDetails } from "../models/property-details";
import { Observable, of } from "rxjs";

@Component({
  selector: "app-property-detail",
  imports: [CommonModule],
  templateUrl: "./property-detail.component.html",
  styleUrl: "./property-detail.component.css",
})
export class PropertyDetailComponent {
  private propertiesService: PropertiesService = inject(PropertiesService);
  propertyDetails$: Observable<PropertyDetails> = of({} as PropertyDetails);

  @Input()
  set id(propertyId: string) {
    if (propertyId) {
      this.propertyDetails$ =
        this.propertiesService.getPropertyDetails(propertyId);
    }
  }
}
