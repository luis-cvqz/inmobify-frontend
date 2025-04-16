import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users.service';
import { NewUser } from '../models/new-user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name: string = '';
  last_name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  async onSubmit() {
    this.errorMessage = '';

    // Validación del lado del cliente
    if (!this.name || !this.last_name || !this.email || !this.phone || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const userData: NewUser = {
      name: this.name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      user_type_id: 1
    };

    try {
      await this.usersService.register(userData);
      await Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada. Por favor, inicia sesión.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#007bff'
      });
      await this.router.navigate(['/login']);
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al registrarse. Verifica tus datos.';
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
