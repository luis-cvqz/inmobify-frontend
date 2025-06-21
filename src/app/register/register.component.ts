import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersService } from '../services/users.service';
import { NewUser } from '../models/new-user';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';

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
  passwordFieldType: string = 'password'; // Para togglear entre 'password' y 'text'
  confirmPasswordFieldType: string = 'password'; // Para togglear entre 'password' y 'text'

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  restrictToNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Solo permite números
    this.phone = input.value; // Actualiza el modelo
  }

  async onSubmit() {
    if (!this.name || !this.last_name || !this.email || !this.phone || !this.password || !this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos.',
      });
      return;
    }

    if (!this.validatePhone(this.phone)) {
      Swal.fire({
        icon: 'error',
        title: 'Teléfono inválido',
        text: 'El teléfono debe contener exactamente 10 dígitos numéricos.',
      });
      return;
    }

    if (this.password !== this.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }

    if (!this.validatePassword(this.password)) {
      Swal.fire({
        icon: 'error',
        title: 'Contraseña inválida',
        text: 'La contraseña debe tener entre 8 y 20 caracteres, contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
      });
      return;
    }

    const hashedPassword = CryptoJS.SHA256(this.password).toString(CryptoJS.enc.Hex);

    const userData: NewUser = {
      name: this.name,
      last_name: this.last_name,
      email: this.email,
      phone: this.phone,
      password: hashedPassword
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al registrarse. Verifica tus datos.',
      });
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }

  private validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,20}$/;
    return passwordRegex.test(password);
  }

  private validatePhone(phone: string): boolean {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }
}
