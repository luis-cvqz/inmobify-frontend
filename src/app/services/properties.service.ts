import { Injectable } from '@angular/core';
import { PropertySummary } from '../models/property-summary';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  url = "http://localhost:12004/boosted-properties"

  constructor() { }

  async getBoostedProperties(): Promise<PropertySummary[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }
}
