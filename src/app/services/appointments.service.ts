import { Injectable } from '@angular/core';
import { NewProspect} from '../models/new-prospect';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  appointmentsUrl = "http://localhost:12000/imf-appointments";

  constructor(private http: HttpClient) { }

  async postProspect(newProspect: NewProspect): Promise<any> {
    const token = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    })
    return firstValueFrom(
      this.http.post<NewProspect>(`${this.appointmentsUrl}/prospect`, newProspect, {headers: headers}),
    )
  }
}
