import { Injectable } from '@angular/core';
import { UserNoPass } from '../models/user-no-pass';
import { NewUser } from '../models/new-user';
import { UpdateUser } from '../models/update-user';
import { OwnerDetails } from '../models/owner-details';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersUrl = 'http://localhost:12000/imf-users/users';

  constructor(private http: HttpClient) {}

  async register(userData: NewUser): Promise<string> {
    try {
      const response = await fetch(this.usersUrl, {
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al registrarse',
      });
      throw error;
    }
  }

  async fetchUser(userId: string): Promise<UserNoPass> {
    const token = localStorage.getItem('jwt_token') || '';
    const response = await fetch(`${this.usersUrl}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }

    return await response.json();
  }

  async updateUser(userId: string, userData: UpdateUser): Promise<void> {
    const token = localStorage.getItem('jwt_token') || '';
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    const response = await fetch(`${this.usersUrl}/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error(`Error en el servidor al actualizar el usuario: ${response.status}`);
    }
  }

  getOwnerDetails(userId: string): Observable<OwnerDetails> {
    return this.http
      .get<OwnerDetails>(`${this.usersUrl}/${userId}`)
      .pipe(
        map((data) => data ?? {}),
        catchError((error) => {
          console.error(`Error fetching owner details`, error);
          return of({} as OwnerDetails);
        })
      );
  }
}
