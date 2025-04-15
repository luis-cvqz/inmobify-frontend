import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private authChange = new Subject<void>();
  authChange$ = this.authChange.asObservable();

  notifyAuthChange(): void {
    this.authChange.next();
  }
}
