import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

interface LoginResponse {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  user_type_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:12000/imf-auth/login';

  constructor() {}

  async login(credentials: { email: string; password: string }): Promise<void> {
    try {
      const hashedPassword = CryptoJS.SHA256(credentials.password).toString(CryptoJS.enc.Hex);
      const credentialsToSend = {
        email: credentials.email,
        password: hashedPassword
      };

      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentialsToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en el servidor al iniciar sesión: ${response.status} ${errorText}`);
      }

      let token = response.headers.get('x-token') || response.headers.get('X-Token') || response.headers.get('X-TOKEN');
      const rawBody = await response.text();
      let body: LoginResponse;

      try {
        body = JSON.parse(rawBody);
      } catch (e) {
        throw new Error('Respuesta del servidor no es JSON válido');
      }

      const uuid = body.id;

      if (token && uuid) {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_uuid', uuid);
      } else {
        throw new Error(`Falta ${!token ? 'token' : ''} ${!uuid ? 'UUID' : ''}`.trim());
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al iniciar sesión',
      });
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt_token');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_uuid');
  }
}
