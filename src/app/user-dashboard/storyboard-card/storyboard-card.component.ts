import { CommonModule } from "@angular/common";
import { Component, Input, Output, EventEmitter, Type } from "@angular/core";

export interface Step {
  component: Type<any>;
}

@Component({
  selector: "app-storyboard-card",
  imports: [CommonModule],
  templateUrl: "./storyboard-card.component.html",
})
export class StoryboardCardComponent {
  @Input() steps: Step[] = [];
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() finished = new EventEmitter<void>();

  currentStepIndex: number = 0;
  showBackdrop: boolean = false;

  ngOnChanges(): void {
    this.showBackdrop = this.isVisible;
    if (!this.isVisible) {
      this.currentStepIndex = 0;
    }
  }

  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
    } else {
      this.finished.emit(); // Emit an event when the last step is reached
      this.closeCard();
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
    }
  }

  closeCard(): void {
    this.isVisibleChange.emit(false);
  }
}
