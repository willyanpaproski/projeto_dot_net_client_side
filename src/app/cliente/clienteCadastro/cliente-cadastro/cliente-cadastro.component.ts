import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';
import { removerMascara } from '../../../shared/utils/formatters';
import { EmpresaListagemComponent } from '../../../empresa/empresaListagem/empresa-listagem/empresa-listagem.component';
import { InputSelectorComponent } from '../../../shared/input-selector/input-selector/input-selector.component';
import { FilialListagemComponent } from '../../../filial/filialListagem/filial-listagem/filial-listagem.component';
import { handleValidationError } from '../../../shared/utils/handle-validation-errors';
import { NotificationService } from '../../../shared/notification/notification.service';

export const CLIENTE_DATA = new InjectionToken<any>('CLIENTE_DATA');
export const FECHAR_MODAL = new InjectionToken<any>('FECHAR_MODAL');

@Component({
  selector: 'app-cliente-cadastro',
  imports: [ReactiveFormsModule, NgxMaskDirective, InputSelectorComponent],
  templateUrl: './cliente-cadastro.component.html',
  styleUrls: ['./cliente-cadastro.component.css']
})
export class ClienteCadastroComponent implements OnInit {

  empresaListagemComponent = EmpresaListagemComponent;
  filialListagemComponent = FilialListagemComponent;

  cliente = inject(CLIENTE_DATA, { optional: true });
  fecharModalAposAtualizarCadastrar = inject(FECHAR_MODAL, { optional: true });
  userForm!: FormGroup;

  cpfCnpjMask: string = '000.000.000-00';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      id: [this.cliente?.id ?? null],
      ativo: [this.cliente?.ativo ?? true],
      nome: [this.cliente?.nome ?? ''],
      cpfCnpj: [this.cliente?.cpfCnpj ?? ''],
      dataNascimento: [this.cliente?.dataNascimento ?? ''],
      tipoPessoa: [this.cliente?.tipoPessoa ?? 'Fisica'],
      email: [this.cliente?.email ?? ''],
      telefone: [this.cliente?.telefone ?? ''],
      celular: [this.cliente?.celular ?? ''],
      cep: [this.cliente?.cep ?? ''],
      endereco: [this.cliente?.endereco ?? ''],
      cidade: [this.cliente?.cidade ?? ''],
      bairro: [this.cliente?.bairro ?? ''],
      estado: [this.cliente?.estado ?? ''],
      rua: [this.cliente?.rua ?? ''],
      complemento: [this.cliente?.complemento ?? ''],
      empresaId: [this.cliente?.empresaId ?? null],
      filialId: [this.cliente?.filialId ?? null]
    });

    this.setCpfCnpjMask(this.userForm.get('tipoPessoa')?.value);

    this.userForm.get('tipoPessoa')?.valueChanges.subscribe((tipo) => {
      this.setCpfCnpjMask(tipo);

      this.userForm.get('cpfCnpj')?.setValue('');
    });
  }

  setCpfCnpjMask(tipoPessoa: string) {
    if (tipoPessoa === 'Juridica') {
      this.cpfCnpjMask = '00.000.000/0000-00';
    } else {
      this.cpfCnpjMask = '000.000.000-00';
    }
  }

  onSubmit() {
    const formData = this.userForm.value;

    const payload = {
      ...formData,
      telefone: removerMascara(formData.telefone),
      celular: removerMascara(formData.celular),
      cep: removerMascara(formData.cep),
      cpfCnpj: removerMascara(formData.cpfCnpj)
    };

    const isEdit = !!this.cliente?.id;

    const request$ = isEdit
      ? this.http.put(`http://localhost:5250/api/cliente/${payload.id}`, payload)
      : this.http.post('http://localhost:5250/api/cliente', payload);

    request$.subscribe({
      next: () => {
        this.notificationService.show(isEdit ? 'Cliente atualizado com sucesso!' : 'Cliente cadastrado com sucesso!', 'success');
        this.fecharModalAposAtualizarCadastrar();
      },
      error: (error) => {
        handleValidationError(error, this.notificationService);
      }
    });
  }

  onEmpresaSelecionada(empresa: any) {
    this.userForm.patchValue({ empresaId: empresa.id });
  }

  onFilialSelecionada(filial: any) {
    this.userForm.patchValue({ filialId: filial.id });
    this.userForm.patchValue({ empresaId: filial.empresa.id });
  }
}
