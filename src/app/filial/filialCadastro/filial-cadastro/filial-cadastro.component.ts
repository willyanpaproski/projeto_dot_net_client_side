import { HttpClient } from '@angular/common/http';
import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../shared/notification/notification.service';
import { removerMascara } from '../../../shared/utils/formatters';
import { handleValidationError } from '../../../shared/utils/handle-validation-errors';
import { EmpresaListagemComponent } from '../../../empresa/empresaListagem/empresa-listagem/empresa-listagem.component';
import { NgxMaskDirective } from 'ngx-mask';
import { InputSelectorComponent } from '../../../shared/input-selector/input-selector/input-selector.component';

export const FILIAL_DATA = new InjectionToken<any>('FILIAL_DATA');
export const FECHAR_MODAL = new InjectionToken<any>('FECHAR_MODAL');

@Component({
  selector: 'app-filial-cadastro',
  imports: [ReactiveFormsModule, NgxMaskDirective, InputSelectorComponent],
  templateUrl: './filial-cadastro.component.html',
  styleUrl: './filial-cadastro.component.css'
})
export class FilialCadastroComponent implements OnInit {

  empresaListagemComponent = EmpresaListagemComponent;

  filial = inject(FILIAL_DATA, { optional: true });
  fecharModalAposAtualizarCadastrar = inject(FECHAR_MODAL, { optional: true })
  userForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [this.filial?.id ?? null],
      ativo: [this.filial?.ativo ?? true],
      nome: [this.filial?.nome ?? ''],
      cnpj: [this.filial?.cnpj ?? ''],
      cep: [this.filial?.cep ?? ''],
      endereco: [this.filial?.endereco ?? ''],
      numero: [this.filial?.numero ?? ''],
      rua: [this.filial?.rua ?? ''],
      cidade: [this.filial?.cidade ?? ''],
      estado: [this.filial?.estado ?? ''],
      bairro: [this.filial?.bairro ?? ''],
      complemento: [this.filial?.complemento ?? ''],
      telefone: [this.filial?.telefone ?? ''],
      celular: [this.filial?.celular ?? ''],
      email: [this.filial?.email ?? ''],
      dataAbertura: [this.filial?.dataAbertura ?? ''],
      cor: [this.filial?.cor ?? ''],
      numeroInstricaoEstadual: [this.filial?.numeroInstricaoEstadual ?? ''],
      numeroInscricaoMunicipal: [this.filial?.numeroInscricaoMunicipal ?? ''],
      numeroAlvara: [this.filial?.numeroAlvara ?? ''],
      observacoes: [this.filial?.observacoes ?? ''],
      empresaId: [this.filial?.empresaId ?? null]
    });

    this.userForm.get('id')?.disable();
  }

  onSubmit(): void {
    const formData = this.userForm.getRawValue();

    const payload = {
      ...formData,
      cnpj: removerMascara(formData.cnpj),
      cep: removerMascara(formData.cep),
      telefone: removerMascara(formData.telefone),
      celular: removerMascara(formData.celular)
    };

    const isEdit = !!this.filial?.id;

    const request$ = isEdit
    ? this.http.put(`http://localhost:5250/api/filial/${payload.id}`, payload)
    : this.http.post(`http://localhost:5250/api/filial`, payload);

    request$.subscribe({
      next: () => {
        this.notificationService.show(isEdit ? 'Filial atualizada com sucesso!' : 'Filial cadastrada com sucesso!');
        this.fecharModalAposAtualizarCadastrar();
      },
      error: (error) => {
        handleValidationError(error, this.notificationService);
      }
    });
  }

  onEmpresaSelecionada(empresa: any): void {
    this.userForm.patchValue({ empresaId: empresa.id });
  }
}
