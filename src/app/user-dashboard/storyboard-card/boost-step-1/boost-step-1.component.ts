import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BoostPlanService } from "../../../services/boost-plan.service";

@Component({
  selector: "app-boost-step-1",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./boost-step-1.component.html",
})
export class BoostStep1Component {
  constructor(private boostPlanService: BoostPlanService) {}
  selectedBoostQuantity: number = 1000;
  @Output() selectedBoostQuantityChange = new EventEmitter<number>();

  onQuantityChange() {
    this.boostPlanService.selectedPlan = this.selectedBoostQuantity;
    this.selectedBoostQuantityChange.emit(this.selectedBoostQuantity);
  }
}
