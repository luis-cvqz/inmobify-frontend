import { Component, Input, Output, EventEmitter} from '@angular/core';
import {NewTransaction} from '../../models/new-transaction';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register-transaction',
  imports: [
    NgIf
  ],
  templateUrl: './register-transaction.component.html',
  styleUrl: './register-transaction.component.css'
})
export class RegisterTransactionComponent {
  @Input() isVisible = false;
  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() finished: EventEmitter<void> = new EventEmitter<void>();

  showBackdrop: boolean = false;

  ngOnChanges() {
    this.showBackdrop = this.isVisible;
  }

  onConfirm(): void {
    this.finished.emit();
    this.closeCard();
  }

  closeCard(): void {
    this.isVisibleChange.emit(false);
  }
}
