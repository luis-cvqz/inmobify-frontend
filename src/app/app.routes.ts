import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { DashboardComponent } from "./user-dashboard/dashboard/dashboard.component";
import { PropertyDetailComponent } from "./property-detail/property-detail.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    title: "Inicio",
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "user-dashboard",
    component: DashboardComponent,
  },
  {
    path: "property-detail/:id",
    component: PropertyDetailComponent,
  },
];
export default routes;
