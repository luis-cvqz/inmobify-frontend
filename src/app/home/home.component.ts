import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PropertyCardComponent } from "../property-card/property-card.component";
import { PropertySummary } from "../models/property-summary";
import { PropertiesService } from "../services/properties.service";

@Component({
  selector: "app-home",
  imports: [CommonModule, FormsModule, PropertyCardComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  searchTerm: string = "";
  cities: string[] = [
    "Santiago",
    "Buenos Aires",
    "Lima",
    "Bogotá",
    "Madrid",
    "Barcelona",
    "Medellín",
    "Quito",
    "Caracas",
    "Montevideo",
  ];
  filteredCities: string[] = [];

  selectedFilter: string = "Todos";

  propertiesService: PropertiesService = inject(PropertiesService);

  private allProperties: PropertySummary[] = [];
  propertyList: PropertySummary[] = [];

  readonly pageSize = 20;
  currentPage = 0;

  constructor() {
    this.loadProperties();
  }

  async loadProperties() {
    this.allProperties = await this.propertiesService.getProperties();
    this.loadNextPage();
  }

  applyFilterAndPagination(resetPage: boolean = true) {
    if (resetPage) this.currentPage = 0;
    this.propertyList = [];

    let filtered = this.filterProperties(this.allProperties);

    this.propertyList = filtered.slice(0, this.pageSize);
    this.currentPage = 1;
  }

  loadNextPage() {
    const filtered = this.filterProperties(this.allProperties);
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.propertyList = this.propertyList.concat(filtered.slice(start, end));
    this.currentPage++;
  }

  hasMoreProperties(): boolean {
    const filtered = this.filterProperties(this.allProperties);
    return this.propertyList.length < filtered.length;
  }

  filterProperties(properties: PropertySummary[]): PropertySummary[] {
    switch (this.selectedFilter) {
      case "Residencias (Venta)":
        return properties.filter(
          (p) => p.property_type === "residential" && p.disposition === "sale"
        );
      case "Residencias (Renta)":
        return properties.filter(
          (p) => p.property_type === "residential" && p.disposition === "lease"
        );
      case "Locales comerciales (Venta)":
        return properties.filter(
          (p) => p.property_type === "commercial" && p.disposition === "sale"
        );
      case "Locales comerciales (Renta)":
        return properties.filter(
          (p) => p.property_type === "commercial" && p.disposition === "lease"
        );
      default:
        return properties;
    }
  }

  changeFilter(filter: string) {
    this.selectedFilter = filter;
    this.applyFilterAndPagination(true);
  }

  onSearch() {
    if (this.searchTerm.length > 0) {
      this.filteredCities = this.cities.filter((city) =>
        city.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    } else {
      this.filteredCities = [];
    }
  }

  selectCity(city: string) {
    this.searchTerm = city;
    this.filteredCities = [];
  }

  filterResults(city: string) {
    console.log(`Searching for: ${city}`);
  }

  onSubmit(event: Event, filterValue: string) {}
}
