import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, PropertyCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchTerm: string = '';
  cities: string[] = ['Santiago', 'Buenos Aires', 'Lima', 'Bogotá', 'Madrid', 'Barcelona', 'Medellín', 'Quito', 'Caracas', 'Montevideo'];
  filteredCities: string[] = [];

  onSearch() {
    if (this.searchTerm.length > 0) {
      this.filteredCities = this.cities.filter(city =>
        city.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredCities = [];
    }
  }

  selectCity(city: string) {
    this.searchTerm = city;
    this.filteredCities = []; // Hide suggestions after selection
  }

  filterResults(city: string) {
    console.log(`Searching for: ${city}`);
  }

  onSubmit(event: Event, filterValue: string) {

  }
}
