import { environment } from "../../environments/environment";
import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PropertiesService } from "../services/properties.service";
import { NewProperty } from "../models/new-property";
import { Router, RouterModule } from "@angular/router";
import { State } from "../models/state";
import { PropertyDetails } from "../models/property-details";
import { Observable, of } from "rxjs";
import { ImageTileComponent } from "./image-tile/image-tile.component";
import Swal from "sweetalert2";
import { Image } from "../models/image";
import { NewImage } from "../models/new-image";

@Component({
  selector: "app-update-property",
  imports: [FormsModule, CommonModule, RouterModule, ImageTileComponent],
  templateUrl: "./update-property.component.html",
})
export class UpdatePropertyComponent {
  constructor(private router: Router) {}

  imageList: Image[] = [];

  formData = {
    title: "",
    description: "",
    no_rooms: 0,
    no_bathrooms: 0,
    disposition_type_id: 1,
    size: "",
    price: "",
    img_path: "",
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

  property_id: string = "";
  mainImageRoute: string = "";

  propertyDetails$: Observable<PropertyDetails> = of({} as PropertyDetails);
  @Input()
  set id(propertyId: string) {
    if (propertyId) {
      this.propertyDetails$ =
        this.propertiesService.getPropertyDetails(propertyId);
      this.propertiesService
        .fetchImagesByProperty(propertyId)
        .then((imageList: Image[]) => {
          this.imageList = imageList;
        });
    } else {
      this.propertyDetails$ = of({} as PropertyDetails);
    }

    this.propertyDetails$.subscribe((details) => {
      this.formData.title = details.title ?? "";
      this.formData.img_path = details.image_path ?? "";
      this.formData.description = details.description ?? "";
      this.formData.price = details.price ?? "";
      this.formData.address = details.street ?? "";
      this.formData.house_number = details.house_number ?? "";
      this.formData.neighborhood = details.neighborhood ?? "";
      this.formData.no_rooms = details.n_rooms ?? "";
      this.formData.no_bathrooms = details.n_bathrooms ?? "";
      this.formData.size = details.sqm.toString() ?? "";
      this.formData.city_name = details.city ?? "";
      this.formData.disposition_type_id = details.disposition_type_id ?? 0;
      this.formData.state_id = details.state_id ?? 0;
      this.formData.latitude = Number(details.latitude) ?? 0;
      this.formData.longitude = Number(details.longitude) ?? 0;
      this.formData.zip_code = details.zip_code ?? "";
      this.formData.property_type_id = details.property_type_id ?? 0;
      this.property_id = details.id ?? "";
      this.mainImageRoute = details.image_path ?? "";
      if (this.map) {
        this.setMarker(this.formData.latitude, this.formData.longitude);
      } else {
        this.pendingMarker = {
          lat: Number(details.latitude),
          lng: Number(details.longitude),
        };
      }
    });
  }

  states: State[] = [];
  submitting = false;

  async handleSetMainImage(imagePath: string) {
    let confirmation = false;
    await Swal.fire({
      title: "¿Deseas establecer esta imágen como principal?",
      imageUrl: this.imageList.find((image) => image.path === imagePath)?.path,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#155dfc",
      cancelButtonColor: "#e7000b",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmation = true;
      }
    });

    if (!confirmation) {
      this.submitting = false;
      return;
    }

    try {
      await this.propertiesService.updateImagePath(this.property_id, imagePath);
      this.mainImageRoute = imagePath;
    } catch {
      await Swal.fire({
        icon: "error",
        text: "No se pudo establecer la imágen, inténtalo de nuevo más tarde",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
    }
  }

  async handleImageDelete(imageId: string) {
    let confirmation = false;
    await Swal.fire({
      title: "¿Deseas eliminar esta imagen?",
      text: "Una vez eliminada no podrá ser recuperada",
      imageUrl: this.imageList.find((image) => image.id === imageId)?.path,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#155dfc",
      cancelButtonColor: "#e7000b",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmation = true;
      }
    });

    if (!confirmation) {
      this.submitting = false;
      return;
    }

    let image_name = this.imageList.find((image) => image.id === imageId)!.name;
    this.imageList = this.imageList.filter((image) => image.id !== imageId);

    try {
      await this.propertiesService.deletePropertyImageDatabase(imageId);
      await this.propertiesService.deletePropertyImageFileServer(
        this.property_id,
        image_name,
      );
    } catch {
      await Swal.fire({
        icon: "error",
        text: "No se pudo eliminar la imagen, inténtalo de nuevo más tarde",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const newFiles = Array.from(input.files);

      const hasDuplicate = newFiles.some((newFile) =>
        this.imageList.some(
          (existingFile) => existingFile.name === newFile.name,
        ),
      );

      if (hasDuplicate) {
        alert("No puede haber dos archivos con el mismo nombre.");
        return;
      }

      const combinedFiles = [...this.formData.images, ...newFiles];

      if (combinedFiles.length > 10 - this.imageList.length) {
        alert("Solo puedes subir hasta 10 imágenes.");
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

    let confirmation = false;
    await Swal.fire({
      title: "¿Deseas guardar los cambios?",
      text: "Una vez hechos no podrán revertirse",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#155dfc",
      cancelButtonColor: "#e7000b",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Continuar",
    }).then((result) => {
      if (result.isConfirmed) {
        confirmation = true;
      }
    });

    if (!confirmation) {
      this.submitting = false;
      return;
    }

    try {
      await this.propertiesService.updateProperty(
        this.property_id,
        newProperty,
      );

      for (const image of this.formData.images) {
        await this.propertiesService.uploadImage(image, this.property_id);
      }

      let imagesInfo = this.createImagesInfo(
        this.property_id,
        this.formData.images,
      );
      await this.propertiesService.insertImagesByProperty(
        this.property_id,
        imagesInfo,
      );

      await Swal.fire({
        icon: "success",
        text: "Se ha modificado la información de la propiedad correctamente",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
      this.router.navigate(["user-dashboard"]);
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

  createImagesInfo(propertyId: string, files: File[]): NewImage[] {
    return files.map((file) => ({
      path: `${this.fileServerUrl}/images/${propertyId}/${file.name}`,
      name: file.name,
    }));
  }

  createPropertyObject(): NewProperty {
    const property = {
      title: this.formData.title,
      description: this.formData.description,
      price: Number(this.formData.price),
      sqm: Number(this.formData.size),
      neighborhood: this.formData.neighborhood,
      image_path: this.formData.img_path,
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
      this.formData.disposition_type_id === 0 ||
      !this.formData.address ||
      this.formData.city_name === "" ||
      this.formData.state_id === 0 ||
      !this.formData.zip_code ||
      this.formData.latitude === 0 ||
      this.formData.longitude === 0 ||
      this.formData.property_type_id === 0
    ) {
      alert(
        "Por favor, completa todos los campos, sube al menos una imagen y selecciona la ubicación en el mapa.",
      );
      return false;
    }
    return true;
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

  marker!: google.maps.Marker;
  pendingMarker: { lat: number; lng: number } | null = null;

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

    this.map.addListener("click", (event: google.maps.MapMouseEvent) => {
      this.placeMarker(event.latLng);
    });
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
