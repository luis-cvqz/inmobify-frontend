import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserDetailsComponent } from "../user-details/user-details.component";
import { RequestsSummaryComponent } from "../requests-summary/requests-summary.component";
import { RouterModule } from "@angular/router";
import { PostsSummaryComponent } from "../posts-summary/posts-summary.component";
import { UpdatePropertyPriority } from "../../models/update-property-priority";
import {
  Step,
  StoryboardCardComponent,
} from "../storyboard-card/storyboard-card.component";
import { BoostStep1Component } from "../storyboard-card/boost-step-1/boost-step-1.component";
import { BoostStep2Component } from "../storyboard-card/boost-step-2/boost-step-2.component";
import { BoostPlanService } from "../../services/boost-plan.service";
import { PropertiesService } from "../../services/properties.service";
import { AppointmentsService } from '../../services/appointments.service';
import Swal from "sweetalert2";
import {UpdateUserComponent} from '../update-user/update-user.component';
import {RegisterTransactionComponent} from '../register-transaction/register-transaction.component';
import {NewTransaction} from '../../models/new-transaction';

@Component({
  selector: "app-dashboard",
  imports: [
    CommonModule,
    UserDetailsComponent,
    RequestsSummaryComponent,
    PostsSummaryComponent,
    StoryboardCardComponent,
    RouterModule,
    UpdateUserComponent,
    RegisterTransactionComponent
  ],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent {
  constructor(
    private boostPlanService: BoostPlanService,
    private propertiesService: PropertiesService,
    private appointmentsService: AppointmentsService,
  ) {}

  showBoostStoryboard: boolean = false;
  boostSteps: Step[] = [
    { component: BoostStep1Component },
    { component: BoostStep2Component },
  ];
  currentBoostedProperty: string = "";

  showEditProfile: boolean = false;
  handleEditClick(): void {
    this.showEditProfile = true;
  }
  closeEditProfile(): void {
    this.showEditProfile = false;
  }
  async onEditProfileFinished() {
    this.closeEditProfile();
    location.reload();
  }

  newTransaction: NewTransaction = {
    prospect_id: "",
    transaction_type_id: 0,
    property_id: ""
  }
  showRegisterTransaction: boolean = false;
  handleRegisterTransaction(transaction  : NewTransaction): void {
    this.newTransaction = transaction;

    this.showRegisterTransaction = true;
  }
  closeRegisterTransaction(): void {
    // Empty the transaction
    this.newTransaction = {
      prospect_id: "",
      transaction_type_id: 0,
      property_id: ""
    }

    this.showRegisterTransaction = false;
  }
  async onRegisterTransactionFinished() {
    try {
      // TODO: enviar transacción
      await this.appointmentsService.postTransaction(this.newTransaction);
      await Swal.fire({
        icon: "success",
        text: "Se ha registrado la transacción correctamente",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
    } catch {
      await Swal.fire({
        icon: "error",
        text: "No se pudo establecer conexión con el servidor, inténtalo de nuevo más tarde",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
    }

    this.closeRegisterTransaction();
  }

  handleBoostClick(property: string): void {
    this.currentBoostedProperty = property;

    this.showBoostStoryboard = true;
  }

  closeBoostStoryboard(): void {
    this.showBoostStoryboard = false;
    this.currentBoostedProperty = "";
  }

  async onBoostStoryboardFinished() {
    let priority = this.boostPlanService.selectedPlan;
    let updatePropertyPriorityDto: UpdatePropertyPriority = {
      new_priority: Number(priority),
    };

    try {
      this.propertiesService.updatePropertyPriority(
        this.currentBoostedProperty,
        updatePropertyPriorityDto,
      );
      await Swal.fire({
        icon: "success",
        text: "Se ha aplicado la promoción a la propiedad correctamente",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
      window.location.reload();
    } catch {
      await Swal.fire({
        icon: "error",
        text: "No se pudo establecer conexión con el servidor, inténtalo de nuevo más tarde",
        confirmButtonText: "OK",
        confirmButtonColor: "#007bff",
      });
    }
    this.closeBoostStoryboard();
  }
}
