import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentsService} from '../../services/appointments.service';
import {ProspectSummary} from '../../models/prospect-summary';
import {PropertiesService} from '../../services/properties.service';
import {firstValueFrom} from 'rxjs';
import {PropertyPreview} from '../../models/property-preview';
import {NewTransaction} from '../../models/new-transaction';

@Component({
  selector: 'app-requests-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests-summary.component.html',
  styleUrl: './requests-summary.component.css'
})
export class RequestsSummaryComponent implements OnInit {
  prospects: ProspectSummary[] = [];
  propertyPreviews: Map<string, PropertyPreview> = new Map();
  userId = localStorage.getItem('user_uuid') || '';
  currentPage = 1;
  pageSize = 3;
  @Output() transaction = new EventEmitter<NewTransaction>();

  get pagedProspects(): ProspectSummary[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.prospects.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.prospects.length / this.pageSize);
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  constructor(
    private appointmentsService: AppointmentsService,
    private propertiesService: PropertiesService,
  ) {}

  async ngOnInit() {
    try {
      if (this.userId) {
        this.prospects = await this.appointmentsService.getProspectsByUserId(this.userId);
        await this.loadPropertyPreviews();
      }
    } catch (err) {
      console.error('Error loading prospects:', err);
      this.prospects = [];
      this.propertyPreviews.clear();
    }
  }

  private async loadPropertyPreviews() {
    if (this.prospects.length === 0) return;

    const propertyIds = [...new Set(this.prospects.map(p => p.property_id))];

    for (const id of propertyIds) {
      try {
        const preview = await firstValueFrom(this.propertiesService.getPropertyPreview(id));
        if (preview && preview.id) {
          this.propertyPreviews.set(id, preview);
        } else {
          console.log(`No valid preview available for property`);
        }
      } catch (err) {
        console.warn(`Failed to load preview for property`, err);
      }
    }
  }

  getPropertyPreview(propertyId: string): PropertyPreview {
    return this.propertyPreviews.get(propertyId)!;
  }

  previousPage() {
    if (this.canGoPrevious) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.canGoNext) {
      this.currentPage++;
    }
  }

  onTransaction(propertyId: any, prospectId: any, dispositionId: number) {
    let newTransaction: NewTransaction = {
      prospect_id: prospectId,
      transaction_type_id: dispositionId,
      property_id: propertyId
    };

    this.transaction.emit(newTransaction);
  }
}
