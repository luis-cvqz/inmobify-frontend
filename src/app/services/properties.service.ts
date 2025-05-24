import { Injectable } from "@angular/core";
import { PropertySummary } from "../models/property-summary";
import { NewProperty } from "../models/new-property";
import { firstValueFrom, map, Observable } from "rxjs";
import { PropertyDetails } from "../models/property-details";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { PropertyPreview } from "../models/property-preview";
import { Image } from "../models/image";
import { NewImage } from "../models/new-image";
import { UpdatePropertyPriority } from "../models/update-property-priority";

@Injectable({
  providedIn: "root",
})
export class PropertiesService {
  propertiesUrl = "http://localhost:12000/imf-properties";
  fileServerUrl = "http://localhost:12000/imf-files";

  constructor(private http: HttpClient) {}

  async getProperties(): Promise<PropertySummary[]> {
    const data = await fetch(`${this.propertiesUrl}/properties`);
    return (await data.json()) ?? [];
  }

  async getUserPropertiesPreview(user_id: string): Promise<PropertyPreview[]> {
    const response = await fetch(
      `${this.propertiesUrl}/user-properties-preview/${user_id}`,
    );
    if (!response.ok)
      throw new Error("Failed to fetch user properties preview");
    return await response.json();
  }

  getPropertyDetails(id: string): Observable<PropertyDetails> {
    return this.http
      .get<PropertyDetails>(`${this.propertiesUrl}/property/${id}`)
      .pipe(map((data) => data ?? {}));
  }

  getPropertyPreview(property_id: string): Observable<PropertyPreview> {
    const token = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    })

    return this.http
      .get<PropertyPreview>(`${this.propertiesUrl}/user-property-preview/${property_id}`, {headers})
      .pipe(map((data) => data ?? {}));
  }

  async uploadImage(file: File, property_uuid: string): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await firstValueFrom(
        this.http.post<any>(
          `http://localhost:12006/upload/${property_uuid}`,
          formData,
          {
            observe: "response",
          },
        ),
      );

      if (response.status === 200) {
        console.log("Image uploaded successfully with status 200");
      } else {
        throw new Error(`Image upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  async updateImagePath(id: string, image_path: string): Promise<any> {
    return await firstValueFrom(
      this.http.put(`${this.propertiesUrl}/property-img-path/${id}`, {
        image_path,
      }),
    );
  }

  async fetchImagesByProperty(id: string): Promise<Image[]> {
    const data = await fetch(`${this.propertiesUrl}/property-images/${id}`);
    return (await data.json()) ?? [];
  }

  async insertImagesByProperty(id: string, images: NewImage[]): Promise<any> {
    return await firstValueFrom(
      this.http.post(`${this.propertiesUrl}/property-images/${id}`, images),
    );
  }

  async deleteAllPropertyImages(id: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${this.propertiesUrl}/property-images/${id}`),
    );
  }

  async deletePropertyImageDatabase(image_uuid: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${this.propertiesUrl}/image/${image_uuid}`),
    );
  }

  async deletePropertyImageFileServer(
    property_uuid: string,
    fileName: string,
  ): Promise<any> {
    return await firstValueFrom(
      this.http.request(
        "DELETE",
        `${this.fileServerUrl}/file/${property_uuid}`,
        {
          body: { filename: fileName },
        },
      ),
    );
  }

  async deletePropertyImagesDirectory(property_uuid: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${this.fileServerUrl}/directory/${property_uuid}`),
    );
  }

  async postProperty(newProperty: NewProperty): Promise<any> {
    return firstValueFrom(
      this.http.post(`${this.propertiesUrl}/property`, newProperty),
    );
  }

  async updateProperty(id: string, updatedProperty: NewProperty): Promise<any> {
    return await firstValueFrom(
      this.http.put(`${this.propertiesUrl}/property/${id}`, updatedProperty),
    );
  }

  async updatePropertyPriority(id: string, priority: UpdatePropertyPriority) {
    return await firstValueFrom(
      this.http.put(`${this.propertiesUrl}/property-priority/${id}`, priority),
    );
  }

  async deleteProperty(id: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${this.propertiesUrl}/property/${id}`),
    );
  }

  async getStates(): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.propertiesUrl}/states`));
  }
}
