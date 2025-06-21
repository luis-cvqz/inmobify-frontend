/// <reference types="@types/google.maps" />

import { environment } from "../../environments/environment";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PropertiesService } from "../services/properties.service";
import { NewProperty } from "../models/new-property";
import { Router, RouterModule } from "@angular/router";
import { State } from "../models/state";
import Swal from "sweetalert2";
import { NewImage } from "../models/new-image";

@Component({
  selector: "app-publish-property",
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: "./publish-property.component.html",
})
export class PublishPropertyComponent {
  constructor(private router: Router) {}

  states: State[] = [];
  termsAccepted: boolean = false;
  submitting = false;
  formData = {
    title: "",
    description: "",
    no_rooms: 0,
    no_bathrooms: 0,
    disposition_type_id: 1,
    size: "",
    price: "",
    images: [] as File[],
    address: "",
    house_number: "",
    neighborhood: "",
    city_name: "",
    state_id: 0,
    latitude: 0,
    longitude: 0,
    zip_code: "",
    property_type_id: 1,
  };

  async onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const newFiles = Array.from(input.files);

      const combinedFiles = [...this.formData.images, ...newFiles];

      if (combinedFiles.length > 10) {
        await Swal.fire({
          icon: "info",
          text: "Solo puedes subir un máximo de 10 imágenes",
          confirmButtonText: "OK",
          confirmButtonColor: "#007bff",
        });
        return;
      }

      this.formData.images = combinedFiles;
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    if (charCode !== 46 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  removeImage(index: number) {
    this.formData.images.splice(index, 1);
  }

  fileServerUrl = "http://localhost:12000/imf-files";
  private propertiesService: PropertiesService = inject(PropertiesService);
  uploadMessages: string[] = [];
  async onSubmit() {
    if (this.submitting) {
      return;
    }

    this.submitting = true;

    if (
      localStorage.getItem("user_uuid") === null ||
      localStorage.getItem("user_uuid") === "" ||
      localStorage.getItem("user_uuid") === undefined
    ) {
      await Swal.fire({
        icon: "warning",
        text: "Debes iniciar sesión para hacer una publicación",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
      this.submitting = false;
      return;
    }

    if (!this.isFormValid()) {
      this.submitting = false;
      await Swal.fire({
        icon: "warning",
        text: "Por favor, completa todos los campos, sube al menos una imagen y selecciona la ubicación en el mapa",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
      return;
    }

    let newProperty = this.createPropertyObject();

    try {
      const propertyId: string =
        await this.propertiesService.postProperty(newProperty);

      for (const image of this.formData.images) {
        await this.propertiesService.uploadImage(image, propertyId);
      }

      await this.propertiesService.updateImagePath(
        propertyId,
        `${this.fileServerUrl}/images/${propertyId}/${this.formData.images[0].name}`,
      );

      let imagesInfo = this.createImagesInfo(propertyId, this.formData.images);
      await this.propertiesService.insertImagesByProperty(
        propertyId,
        imagesInfo,
      );

      await Swal.fire({
        icon: "success",
        text: "¡Tu propiedad ha sido publicada!",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
      this.router.navigate([""]);
    } catch (error) {
      await Swal.fire({
        icon: "error",
        text: "No se pudo establecer conexión con el servidor, inténtalo de nuevo más tarde",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
      return;
    } finally {
      this.submitting = false;
    }
  }

  createPropertyObject(): NewProperty {
    const property = {
      title: this.formData.title,
      description: this.formData.description,
      price: Number(this.formData.price),
      sqm: Number(this.formData.size),
      neighborhood: this.formData.neighborhood,
      image_path: "",
      disposition_type_id: Number(this.formData.disposition_type_id),
      street: this.formData.address,
      city_name: this.formData.city_name,
      state_id: this.formData.state_id,
      zip_code: this.formData.zip_code,
      n_rooms: this.formData.no_rooms,
      n_bathrooms: this.formData.no_bathrooms,
      latitude: this.formData.latitude.toString(),
      longitude: this.formData.longitude.toString(),
      priority: 0,
      owner_id: localStorage.getItem("user_uuid") || "",
      house_number: this.formData.house_number,
      property_type_id: Number(this.formData.property_type_id),
    };

    return property;
  }

  isFormValid() {
    if (
      !this.formData.title ||
      !this.formData.description ||
      !this.formData.price ||
      !this.formData.size ||
      !this.formData.neighborhood ||
      !this.formData.images.length ||
      this.formData.disposition_type_id === 0 ||
      !this.formData.address ||
      this.formData.city_name === "" ||
      this.formData.state_id === 0 ||
      !this.formData.zip_code ||
      this.formData.latitude === 0 ||
      this.formData.longitude === 0 ||
      this.formData.images.length === 0 ||
      this.formData.property_type_id === 0
    ) {
      return false;
    }
    return true;
  }

  createImagesInfo(propertyId: string, files: File[]): NewImage[] {
    return files.map((file) => ({
      path: `${this.fileServerUrl}/images/${propertyId}/${file.name}`,
      name: file.name,
    }));
  }

  map!: google.maps.Map;

  async ngOnInit(): Promise<void> {
    try {
      await this.loadGoogleMapsScript();
      this.initMap();
      this.states = await this.propertiesService.getStates();
    } catch (error) {
      console.error("Failed to load states", error);
    }
  }

  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof google !== "undefined" && google.maps) {
        console.log("Google Maps API already loaded.");
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;

      (window as any).initMap = () => {
        console.log("Google Maps script loaded successfully.");
        resolve();
      };

      script.onerror = (error) => {
        console.error("Error loading Google Maps script:", error);
        reject(new Error("Failed to load Google Maps script"));
      };

      document.head.appendChild(script);
    });
  }

  initMap(): void {
    if (typeof google === "undefined" || !google.maps) {
      console.error("Google Maps API not loaded.");
      return;
    }

    this.map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        center: { lat: 23.6345, lng: -102.5528 },
        zoom: 4,
      },
    );

    this.map.addListener("click", (event: google.maps.MapMouseEvent) => {
      this.placeMarker(event.latLng);
    });
  }

  marker!: google.maps.Marker;

  placeMarker(latLng: google.maps.LatLng | null): void {
    if (!latLng) return;

    if (this.marker) {
      this.marker.setPosition(latLng);
    } else {
      this.marker = new google.maps.Marker({
        position: latLng,
        map: this.map,
      });
    }

    this.formData.latitude = latLng.lat();
    this.formData.longitude = latLng.lng();
  }
}
