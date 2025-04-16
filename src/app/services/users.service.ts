import { Injectable } from '@angular/core';
import { UserNoPass } from '../models/user-no-pass';
import { NewUser } from '../models/new-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private url = 'http://localhost:12000/imf-users/users';

  constructor() {}

  async register(userData: NewUser): Promise<string> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en el servidor al registrarse: ${response.status} ${errorText}`);
      }

      const uuid = await response.text();
      if (!uuid) {
        throw new Error('No se recibió el UUID del usuario.');
      }

      return uuid;
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrarse');
    }
  }

  async fetchUser(userId: string): Promise<UserNoPass> {
    const token = localStorage.getItem('jwt_token') || '';
    const response = await fetch(`${this.url}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    const user = await response.json();
    return user;
  }
}
