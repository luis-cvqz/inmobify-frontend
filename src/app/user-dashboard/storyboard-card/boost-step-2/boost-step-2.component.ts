import { Component } from "@angular/core";
import { BoostPlanService } from "../../../services/boost-plan.service";

@Component({
  selector: "app-boost-step-2",
  imports: [],
  templateUrl: "./boost-step-2.component.html",
})
export class BoostStep2Component {
  selectedBoostPlan: number = 0;
  constructor(private boostPlanService: BoostPlanService) {}

  ngOnInit() {
    this.selectedBoostPlan = this.boostPlanService.selectedPlan;
  }
}
