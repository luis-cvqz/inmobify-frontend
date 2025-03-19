import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { DashboardComponent } from "./user-dashboard/dashboard/dashboard.component";

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
];
export default routes;
