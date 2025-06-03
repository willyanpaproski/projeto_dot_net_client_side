import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../shared/notification/notification.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'access_token';

  constructor(
    private http: HttpClient,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  login(email: string, senha: string) {
    return this.http.post<any>('http://localhost:5250/api/usuario/login', { email, senha }).pipe(
      tap(response => {
        if (this.isLocalStorageAvailable()) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
        }
      })
    );
  }

  logout() {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.tokenKey);
      const usuarioStr = localStorage.getItem('usuario');
      const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
      this.http.post('http://localhost:5250/api/logAcesso', {
        tipoLogAcesso: 'Logout',
        usuarioId: usuario.id,
        usuario: usuario
      }).subscribe({
        next: () => {
          this.router.navigate(['/login']);
          location.reload();
          this.notificationService.show('Logout realizado com sucesso!', 'success');
        },
        error: () => {
          this.notificationService.show('Erro ao realizar logout!', 'error');
        }
      });
    }
  }

  isAuthenticated(): boolean {
    return this.isLocalStorageAvailable() && !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return this.isLocalStorageAvailable() ? localStorage.getItem(this.tokenKey) : null;
  }
}
