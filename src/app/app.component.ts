import { Component, HostListener, inject, PLATFORM_ID, signal } from '@angular/core';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { MainComponent } from './main/main.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NotificationComponent } from './shared/notification/notification.component';
import { AuthService } from './auth/auth.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    LeftSidebarComponent,
    MainComponent,
    NotificationComponent,
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private auth: AuthService, private router: Router) {}

  private readonly platformId = inject(PLATFORM_ID);
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(0);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth.set(window.innerWidth);
      if (this.screenWidth() < 1024) {
        this.isLeftSidebarCollapsed.set(true);
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated() && this.router.url !== '/login';
  }
}
