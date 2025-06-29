import { Injectable } from '@angular/core';
import { NewProspect} from '../models/new-prospect';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {firstValueFrom, map} from 'rxjs';
import {ProspectSummary} from '../models/prospect-summary';
import {CheckProspect} from '../models/check-prospect';
import { NewTransaction } from '../models/new-transaction';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  appointmentsUrl = environment.appointmentsUrl;

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

  async getProspectsByUserId(userId: string): Promise<ProspectSummary[]> {
    const token = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    });

    const response = await firstValueFrom(
      this.http.get<ProspectSummary[]>(
        `${this.appointmentsUrl}/user-prospects/${userId}`,
        { headers }
      )
    );
    return response;
  }

  async checkProspectExists(checkProspect: CheckProspect): Promise<boolean> {
    const response = await firstValueFrom(
      this.http.post<boolean>(
          `${this.appointmentsUrl}/prospect/exists`,
          checkProspect
      )
    );
    return response;
  }

  async postTransaction(newTransaction: NewTransaction): Promise<any> {
    const token = localStorage.getItem("jwt_token");
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? {Authorization: `Bearer ${token}`} : {})
    })

    return firstValueFrom(
      this.http.post<NewTransaction>(`${this.appointmentsUrl}/transaction`, newTransaction, {headers: headers}),
    )
  }
}
