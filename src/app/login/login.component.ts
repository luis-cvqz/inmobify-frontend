import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { AuthStateService } from '../services/auth-state.service';

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
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private authStateService: AuthStateService,
    private router: Router
  ) {}

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    const credentials = {
      email: this.email,
      password: this.password
    };

    try {
      await this.authService.login(credentials);
      const userId = localStorage.getItem('user_uuid');

      if (userId) {
        await this.usersService.fetchUser(userId);
        this.authStateService.notifyAuthChange();
        await this.router.navigate(['/']);
      } else {
        this.errorMessage = 'No se recibió el ID del usuario.';
      }
    } catch (error: any) {
      this.errorMessage = error.message === 'Falta token' ? 'No se recibió el token de autenticación. Contacta al administrador.' : error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
    }
  }
}
