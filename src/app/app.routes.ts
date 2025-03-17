import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        title: "Inicio",
    },
    {
      path: "login",
      component: LoginComponent
    },
];
export default routes;
