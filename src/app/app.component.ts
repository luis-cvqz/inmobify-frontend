import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-root',
  imports: [HomeComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'inmobify';
}
