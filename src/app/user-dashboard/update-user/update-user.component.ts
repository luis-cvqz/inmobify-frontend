import { Component, Input, Output, EventEmitter, Type } from '@angular/core';
import { UpdateUser } from '../../models/update-user'
import { UsersService} from '../../services/users.service';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() finished: EventEmitter<void> = new EventEmitter<void>();

  showBackdrop: boolean = false;
  user: UpdateUser = {
    name: '',
    last_name: '',
    email: '',
    phone: '',
    password: undefined
  }

  constructor(
    private usersServices: UsersService,
  ) {}

  ngOnInit() {
    this.getUserInfo();
  }

  ngOnChanges() {
    this.showBackdrop = this.isVisible;
  }

  async onSubmit() {
    if (!this.user.name || !this.user.last_name || !this.user.email || !this.user.phone) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.',
      });
      return;
    }

    if (!this.validatePhone(this.user.phone)) {
      await Swal.fire({
        icon: 'error',
        title: 'Teléfono inválido',
        text: 'El teléfono debe contener exactamente 10 dígitos numéricos.',
      });
      return;
    }

    if (this.user.password && !this.validatePassword(this.user.password)) {
      await Swal.fire({
        icon: 'error',
        title: 'Contraseña inválida',
        text: 'La contraseña debe tener entre 8 y 20 caracteres, contener al menos una mayúscula, una minúscula, un número y un carácter especial.',
      });
      return;
    }

    const userData: Partial<UpdateUser> = {
      name: this.user.name,
      last_name: this.user.last_name,
      email: this.user.email,
      phone: this.user.phone
    };

    if (this.user.password) {
      userData.password = CryptoJS.SHA256(this.user.password).toString(CryptoJS.enc.Hex);
    }

    try {
      const userId = localStorage.getItem('user_uuid');
      if (!userId) {
        throw new Error('No se encontró el ID del usuario.');
      }
      await this.usersServices.updateUser(userId, userData as UpdateUser);
      await Swal.fire({
        icon: 'success',
        title: '¡Actualización exitosa!',
        text: 'Tu perfil ha sido actualizado correctamente.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#007bff'
      });
      this.finished.emit();
      this.closeForm();
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al actualizar el perfil. Verifica tus datos.',
      });
    }
  }

  private async getUserInfo() {
    const userId = localStorage.getItem('user_uuid');

    try {
      if (userId) {
        const userData = await this.usersServices.fetchUser(userId);
        this.user = {
          name: userData.name,
          last_name: userData.last_name,
          email: userData.email,
          phone: userData.phone
        }
      } else {
        throw new Error('No se recibió el ID del usuario.');
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al recuperar la información del usuario. Inténtelo de nuevo más tarde.',
      });
    }
  }

  closeForm(): void {
    this.isVisibleChange.emit(false);
  }

  restrictToNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.user.phone = input.value;
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
