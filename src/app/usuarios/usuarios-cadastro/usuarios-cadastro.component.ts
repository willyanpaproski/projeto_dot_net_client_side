import { HttpClient } from '@angular/common/http';
import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../shared/notification/notification.service';
import { handleValidationError } from '../../shared/utils/handle-validation-errors';
import { CommonModule } from '@angular/common';
import { formatDateTime } from '../../shared/utils/formatters';

export const FECHAR_MODAL = new InjectionToken<any>('FECHAR_MODAL');
export const USUARIO_DATA = new InjectionToken<any>('USUARIO_DATA');

@Component({
  selector: 'app-usuarios-cadastro',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './usuarios-cadastro.component.html',
  styleUrl: './usuarios-cadastro.component.css'
})
export class UsuariosCadastroComponent implements OnInit {
  usuario = inject(USUARIO_DATA, { optional: true });
  fecharModal = inject(FECHAR_MODAL, { optional: true });
  form!: FormGroup;
  modoEdicao?: boolean = true;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const formattedLastLoggedIn = formatDateTime(this.usuario?.lastLoggedIn);

    this.form = this.fb.group({
      id: [this.usuario?.id ?? null],
      ativo: [this.usuario?.ativo ?? true],
      nomeUsuario: [this.usuario?.nomeUsuario ?? ""],
      email: [this.usuario?.email ?? ""],
      senhaHash: [this.usuario?.senhaHash ?? ""],
      lastLoggedIn: [formattedLastLoggedIn ?? ""]
    });

    if (this.usuario?.id == undefined) {
      this.modoEdicao = false;
    }

    this.form.get('id')?.disable();
    this.form.get('lastLoggedIn')?.disable();
  }

  onSubmit(): void {
    const formData = this.form.getRawValue();

    const isEdit = !!this.usuario?.id;

    const request$ = isEdit
    ? this.http.put(`http://localhost:5250/api/usuario/${this.usuario?.id}`, formData)
    : this.http.post('http://localhost:5250/api/usuario', formData);

    request$.subscribe({
      next: () => {
        this.notificationService.show(isEdit ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!', 'success');
        this.fecharModal();
      },
      error: (error) => {
        handleValidationError(error, this.notificationService);
      }
    });
  }
}
