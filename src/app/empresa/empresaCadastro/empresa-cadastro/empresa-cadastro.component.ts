import { HttpClient } from '@angular/common/http';
import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../shared/notification/notification.service';
import { removerMascara } from '../../../shared/utils/formatters';
import { handleValidationError } from '../../../shared/utils/handle-validation-errors';
import { NgxMaskDirective } from 'ngx-mask';

export const EMPRESA_DATA = new InjectionToken<any>('EMPRESA_DATA');
export const FECHAR_MODAL = new InjectionToken<any>('FECHAR_MODAL');

@Component({
  selector: 'app-empresa-cadastro',
  imports: [ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './empresa-cadastro.component.html',
  styleUrl: './empresa-cadastro.component.css'
})
export class EmpresaCadastroComponent implements OnInit {
  empresa = inject(EMPRESA_DATA, { optional: true });
  fecharModalAposAtualizarCadastrar = inject(FECHAR_MODAL, { optional: true });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  userForm!: FormGroup;

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [this.empresa?.id ?? null],
      ativo: [this.empresa?.ativo ?? true],
      razaoSocial: [this.empresa?.razaoSocial ?? ''],
      nomeFantasia: [this.empresa?.nomeFantasia ?? ''],
      dataFundacao: [this.empresa?.dataFundacao ?? ''],
      cnpj: [this.empresa?.cnpj ?? ''],
      cep: [this.empresa?.cep ?? ''],
      endereco: [this.empresa?.endereco ?? ''],
      numero: [this.empresa?.numero ?? ''],
      cidade: [this.empresa?.cidade ?? ''],
      bairro: [this.empresa?.bairro ?? ''],
      rua: [this.empresa?.rua ?? ''],
      complemento: [this.empresa?.complemento ?? ''],
      site: [this.empresa?.site ?? ''],
      email: [this.empresa?.email ?? ''],
      telefone: [this.empresa?.telefone ?? ''],
      cor: [this.empresa?.cor ?? ''],
      observacoes: [this.empresa?.observacoes ?? '']
    });

    this.userForm.get('id')?.disable();
  }

  onSubmit(): void {
    const formData = this.userForm.getRawValue();

    const payload = {
      ...formData,
      cnpj: removerMascara(formData.cnpj),
      cep: removerMascara(formData.cep),
      telefone: removerMascara(formData.telefone)
    };

    const isEdit = !!this.empresa?.id;

    const request$ = isEdit
    ? this.http.put(`http://localhost:5250/api/empresa/${payload.id}`, payload)
    : this.http.post('http://localhost:5250/api/empresa', payload);

    request$.subscribe({
      next: () => {
        this.notificationService.show(isEdit ? 'Empresa atualizada com sucesso!' : 'Empresa cadastrada com sucesso!');
        this.fecharModalAposAtualizarCadastrar();
      },
      error: (error) => {
        handleValidationError(error, this.notificationService);
      }
    });
  }
}
