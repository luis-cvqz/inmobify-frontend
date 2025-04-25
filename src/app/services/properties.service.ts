import { Injectable } from "@angular/core";
import { PropertySummary } from "../models/property-summary";
import { from, map, Observable } from "rxjs";
import { PropertyDetails } from "../models/property-details";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PropertiesService {
  url = "http://localhost:12000/imf-properties";

  constructor(private http: HttpClient) {}

  async getBoostedProperties(): Promise<PropertySummary[]> {
    const data = await fetch(
      `http://localhost:12000/imf-properties/boosted-properties`,
    );
    return (await data.json()) ?? [];
  }

  getPropertyDetails(id: string): Observable<PropertyDetails> {
    return this.http
      .get<PropertyDetails>(`${this.url}/property/${id}`)
      .pipe(map((data) => data ?? {}));
  }
}
