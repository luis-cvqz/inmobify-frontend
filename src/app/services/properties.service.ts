import { Injectable } from "@angular/core";
import { PropertySummary } from "../models/property-summary";
import { NewProperty } from "../models/new-property";
import { firstValueFrom, map, Observable } from "rxjs";
import { PropertyDetails } from "../models/property-details";
import { HttpClient } from "@angular/common/http";
import { PropertyPreview } from "../models/property-preview";

@Injectable({
  providedIn: "root",
})
export class PropertiesService {
  propertiesUrl = "http://localhost:12000/imf-properties";
  fileServerUrl = "http://localhost:12000/imf-files";

  constructor(private http: HttpClient) {}

  async getBoostedProperties(): Promise<PropertySummary[]> {
    const data = await fetch(`${this.propertiesUrl}/boosted-properties`);
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

  async updateImagePath(id: string, img_path: string): Promise<any> {
    return await firstValueFrom(
      this.http.put(`${this.propertiesUrl}/property-img-path/${id}`, {
        img_path,
      }),
    );
  }

  async deletePropertyImage(
    property_uuid: string,
    fileName: string,
  ): Promise<any> {
    return await firstValueFrom(
      this.http.delete(
        `${this.fileServerUrl}/imf-files/file/${property_uuid}`,
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

  async deleteProperty(id: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${this.propertiesUrl}/property/${id}`),
    );
  }

  async getStates(): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.propertiesUrl}/states`));
  }
}
