import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    NgOptimizedImage,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    console.log('onSubmit ejecutado', { email: this.email, password: this.password });

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      console.log('Campos vacíos');
      return;
    }

    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.errorMessage = 'Error al iniciar sesión. Verifica tus credenciales o la conexión al servidor.';
      }
    });
  }
}
