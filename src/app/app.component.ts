import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { UsersService } from "./services/users.service";
import { AuthStateService } from "./services/auth-state.service";
import { UserNoPass } from "./models/user-no-pass";
import { CommonModule } from "@angular/common";
import { GoogleMapsModule } from "@angular/google-maps";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, CommonModule, GoogleMapsModule],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  user: UserNoPass | null = null;
  showUserMenu: boolean = false;
  title = "inmobify";

  @ViewChild('menuRef') menuRef!: ElementRef;
  @ViewChild('menuRefMobile') menuRefMobile!: ElementRef;

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private authStateService: AuthStateService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.checkAuthState();

    this.authStateService.authChange$.subscribe(() => {
      this.checkAuthState();
    });

    // Agregar listener global para clics
    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    // Limpiar el listener global para evitar memory leaks
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  async checkAuthState(): Promise<void> {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const userId = localStorage.getItem("user_uuid");
      if (userId) {
        try {
          this.user = await this.usersService.fetchUser(userId);
          this.isAuthenticated = !!this.user;
        } catch (error) {
          console.error("AppComponent - Error loading user:", error);
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

  handleClickOutside(event: MouseEvent): void {
    const target = event.target as Node;
    const isClickInsideMenu =
      (this.menuRef && this.menuRef.nativeElement.contains(target)) ||
      (this.menuRefMobile && this.menuRefMobile.nativeElement.contains(target));
    const isClickOnToggleButton = (event.target as HTMLElement).closest('button[title="Perfil de usuario"]');

    if (!isClickInsideMenu && !isClickOnToggleButton && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }
}
