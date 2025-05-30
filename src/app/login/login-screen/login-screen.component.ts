import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../shared/notification/notification.service';

@Component({
  selector: 'app-login-screen',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-screen.component.html',
  styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent {
  email = '';
  senha = '';
  erro = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  login() {
    this.auth.login(this.email, this.senha).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.notificationService.show('Login realizado com sucesso!', 'success');
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
