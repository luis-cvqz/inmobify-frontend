import { Component, inject, Input } from "@angular/core";
import { firstValueFrom, Observable, of, switchMap, tap } from "rxjs";
import { PropertyDetails } from "../models/property-details";
import { PropertiesService } from "../services/properties.service";
import { environment } from "../../environments/environment";
import { CommonModule } from "@angular/common";
import {OwnerDetails} from '../models/owner-details';
import {UsersService} from '../services/users.service';
import {AppointmentsService} from '../services/appointments.service';
import {UserNoPass} from '../models/user-no-pass';
import {NewProspect} from '../models/new-prospect';
import { Image } from "../models/image";
import Swal from 'sweetalert2';

@Component({
  selector: "app-property-detail",
  imports: [CommonModule],
  templateUrl: "./property-detail.component.html",
})
export class PropertyDetailComponent {
  private propertiesService = inject(PropertiesService);
  private usersService = inject(UsersService);
  private appointmentsService = inject(AppointmentsService);
  propertyDetails$: Observable<PropertyDetails> = of({} as PropertyDetails);
  ownerDetails$: Observable<OwnerDetails> = of({} as OwnerDetails);
  images: Image[] = [];
  currentIndex = 0;

  @Input()
  set id(propertyId: string) {
    if (propertyId) {
      this.propertyDetails$ =
        this.propertiesService.getPropertyDetails(propertyId);

      this.propertiesService
        .fetchImagesByProperty(propertyId)
        .then((imageList: Image[]) => {
          this.images = imageList;
          this.currentIndex = 0;
        });

      this.ownerDetails$ = this.propertyDetails$.pipe(
        switchMap((details) => {
          if (details.owner_id) {
            return this.usersService.getOwnerDetails(details.owner_id);
          }
          return of({} as OwnerDetails);
        }),
      );
    } else {
      this.images = [];
      this.currentIndex = 0;
      this.propertyDetails$ = of({} as PropertyDetails);
      this.ownerDetails$ = of({} as OwnerDetails);
    }
  }

  prevImage(): void {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goToImage(index: number): void {
    this.currentIndex = index;
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

  async onContact(): Promise<void> {
    const userId = localStorage.getItem('user_uuid');
    const token = localStorage.getItem('jwt_token');

    if (!userId || userId === '' || !token || token === '') {
      await Swal.fire({
        icon: 'warning',
        title: '¡Aviso!',
        text: 'Debes inicar sesión para contactar al propietario.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#007bff'
      });
      return;
    }

    try {
      const user: UserNoPass = await this.usersService.fetchUser(userId);
      const propertyDetails = await firstValueFrom(this.propertyDetails$);
      const ownerDetails = await firstValueFrom(this.ownerDetails$);

      if (!propertyDetails?.id || !ownerDetails?.id) {
        await Swal.fire({
          icon: 'error',
          title: '¡Error!',
          text: 'Sucedió un error al crear la solicitud de contacto',
          confirmButtonText: 'OK',
          confirmButtonColor: '#007bff'
        });
        return;
      }

      const prospect: NewProspect = {
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        property_id: propertyDetails.id,
        owner_id: ownerDetails.id,
      };

      const prospectId: string = await this.appointmentsService.postProspect(prospect);

      await Swal.fire({
        icon: 'success',
        title: '¡Solicitud enviada!',
        text: 'Tu solicitud de contacto se ha enviado exitosamente',
        confirmButtonText: 'OK',
        confirmButtonColor: '#007bff'
      });

    } catch (error) {
      console.error("Error creating prospect:", error);
      await Swal.fire({
        icon: 'error',
        title: '¡Error!',
        text: 'Ocurrió un error al procesa la solicitud',
        confirmButtonText: 'OK',
        confirmButtonColor: '#007bff'
      });
      return;
    }
  }
}
