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

  propertiesService: PropertiesService = inject(PropertiesService);
  propertyList: PropertySummary[] = [];

  constructor() {
    this.propertiesService
      .getBoostedProperties()
      .then((propertyList: PropertySummary[]) => {
        this.propertyList = propertyList;
      });
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
