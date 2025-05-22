import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppointmentsService} from '../../services/appointments.service';
import {ProspectSummary} from '../../models/prospect-summary';

@Component({
  selector: 'app-requests-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './requests-summary.component.html',
  styleUrl: './requests-summary.component.css'
})
export class RequestsSummaryComponent implements OnInit {
  prospects: ProspectSummary[] = [];
  userId = localStorage.getItem('user_uuid') || '';
  currentPage = 1;
  pageSize = 3;

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
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      if (this.userId) {
        this.prospects = await this.appointmentsService.getProspectsByUserId(this.userId);
      }
    } catch (err) {
      console.error('Error loading prospects:', err);
      this.prospects = [];
    }
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
}
