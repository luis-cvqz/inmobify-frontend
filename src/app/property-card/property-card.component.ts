import { Component, Input } from '@angular/core';
import { PropertySummary } from '../models/property-summary';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-card',
  imports: [CommonModule],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.css'
})
export class PropertyCardComponent {
  @Input() propertySummary!: PropertySummary;
}
