import { Component, inject, Input } from "@angular/core";
import { Observable, of } from "rxjs";
import { PropertyDetails } from "../models/property-details";
import { PropertiesService } from "../services/properties.service";
import { environment } from "../../environments/environment";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-property-detail",
  imports: [CommonModule],
  templateUrl: "./property-detail.component.html",
})
export class PropertyDetailComponent {
  private propertiesService = inject(PropertiesService);
  propertyDetails$: Observable<PropertyDetails> = of({} as PropertyDetails);

  @Input()
  set id(propertyId: string) {
    if (propertyId) {
      this.propertyDetails$ =
        this.propertiesService.getPropertyDetails(propertyId);
    } else {
      this.propertyDetails$ = of({} as PropertyDetails);
    }
  }

  map!: google.maps.Map;
  marker!: google.maps.Marker;
  pendingMarker: { lat: number; lng: number } | null = null;
  async ngOnInit(): Promise<void> {
    try {
      await this.loadGoogleMapsScript();
      this.initMap();

      this.propertyDetails$.subscribe({
        next: (details: PropertyDetails) => {
          if (details.latitude && details.longitude) {
            if (this.map) {
              this.setMarker(
                Number(details.latitude),
                Number(details.longitude),
              );
            } else {
              this.pendingMarker = {
                lat: Number(details.latitude),
                lng: Number(details.longitude),
              };
            }
          } else {
            console.warn("Property details missing latitude/longitude");
          }
        },
        error: (error) => {
          console.error("Error fetching property details:", error);
        },
      });
    } catch (error) {
      console.error("Google Maps failed to load:", error);
    }
  }

  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;

      (window as any).initMap = () => resolve();
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  initMap(attempts = 10): void {
    if (attempts <= 0) {
      console.error("Failed to find map div after multiple attempts.");
      return;
    }

    const mapDiv = document.getElementById("map");
    if (!mapDiv) {
      console.warn("Map div not found, retrying...");
      setTimeout(() => this.initMap(attempts - 1), 100);
      return;
    }

    this.map = new google.maps.Map(mapDiv as HTMLElement, {
      center: { lat: 23.6345, lng: -102.5528 },
      zoom: 4,
    });

    if (this.pendingMarker) {
      this.setMarker(this.pendingMarker.lat, this.pendingMarker.lng);
      this.pendingMarker = null;
    }
  }

  setMarker(lat: number, lng: number): void {
    if (!this.map) {
      console.warn("Map not initialized, cannot set marker.");
      return;
    }

    const position = { lat, lng };
    if (!this.marker) {
      this.marker = new google.maps.Marker({ position, map: this.map });
    } else {
      this.marker.setPosition(position);
    }
    this.map.setCenter(position);
    this.map.setZoom(14);
  }
}
