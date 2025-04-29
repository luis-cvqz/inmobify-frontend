import { Injectable } from "@angular/core";
import { PropertySummary } from "../models/property-summary";
import { NewProperty } from "../models/new-property";
import { firstValueFrom, map, Observable } from "rxjs";
import { PropertyDetails } from "../models/property-details";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PropertiesService {
  url = "http://localhost:12000/imf-properties";

  constructor(private http: HttpClient) {}

  async getBoostedProperties(): Promise<PropertySummary[]> {
    const data = await fetch(`${this.url}/boosted-properties`);
    return (await data.json()) ?? [];
  }

  getPropertyDetails(id: string): Observable<PropertyDetails> {
    return this.http
      .get<PropertyDetails>(`${this.url}/property/${id}`)
      .pipe(map((data) => data ?? {}));
  }

  async uploadImage(file: File, property_uuid: string): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await firstValueFrom(
        this.http.post<any>(
          `https://inmobify-file-server-n2yz.shuttle.app/upload/${property_uuid}`,
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
      this.http.put(`${this.url}/property-img-path/${id}`, { img_path }),
    );
  }

  async postProperty(newProperty: NewProperty): Promise<any> {
    return firstValueFrom(this.http.post(`${this.url}/property`, newProperty));
  }

  async getStates(): Promise<any> {
    return await firstValueFrom(this.http.get(`${this.url}/states`));
  }
}
