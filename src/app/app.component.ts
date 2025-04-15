import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { AuthStateService } from './services/auth-state.service';
import { UserNoPass } from './models/user-no-pass';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean = false;
  user: UserNoPass | null = null;
  showUserMenu: boolean = false;
  title = 'inmobify';

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private authStateService: AuthStateService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.checkAuthState();

    this.authStateService.authChange$.subscribe(() => {
      this.checkAuthState();
    });
  }

  async checkAuthState(): Promise<void> {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const userId = localStorage.getItem('user_uuid');
      if (userId) {
        try {
          this.user = await this.usersService.fetchUser(userId);
          this.isAuthenticated = !!this.user;
        } catch (error) {
          console.error('AppComponent - Error loading user:', error);
          this.authService.logout();
          this.isAuthenticated = false;
          this.user = null;
        }
      } else {
        this.isAuthenticated = false;
        this.user = null;
      }
    } else {
      this.user = null;
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
    this.isAuthenticated = false;
    this.showUserMenu = false;
    this.authStateService.notifyAuthChange();
  }
}
