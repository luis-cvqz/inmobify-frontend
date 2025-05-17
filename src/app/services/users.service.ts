import { Injectable } from '@angular/core';
import { UserNoPass } from '../models/user-no-pass';
import { NewUser } from '../models/new-user';
import {OwnerDetails} from '../models/owner-details';
import {catchError, map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

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
      throw new Error(error.message || 'Error al registrarse');
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

  getOwnerDetails(userId: string): Observable<OwnerDetails> {
    return this.http.
      get<OwnerDetails>(`${this.usersUrl}/${userId}`).
      pipe(map((data) => data ?? {}),
      catchError(error => {
        console.error(`Error fetching owner details`, error);
        return of({} as OwnerDetails);
      })
    );
  }
}


