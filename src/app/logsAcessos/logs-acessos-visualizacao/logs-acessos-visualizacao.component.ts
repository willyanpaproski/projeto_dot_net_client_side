import { CommonModule } from '@angular/common';
import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export const VIEW_MODE = new InjectionToken<any>('VIEW_MODE');
export const LOG_ACESSO_DATA = new InjectionToken<any>('LOG_ACESSO_DATA');
export const FECHAR_MODAL = new InjectionToken<any>('FECHAR_MODAL');

@Component({
  selector: 'app-logs-acessos-visualizacao',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './logs-acessos-visualizacao.component.html',
  styleUrl: './logs-acessos-visualizacao.component.css'
})
export class LogsAcessosVisualizacaoComponent implements OnInit {
  logAcesso = inject(LOG_ACESSO_DATA, { optional: true });
  fecharModal = inject(FECHAR_MODAL, { optional: true });
  viewMode = inject(VIEW_MODE, { optional: true });
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.logAcesso);
    this.form = this.fb.group({
      id: [this.logAcesso?.id ?? null],
      tipoLogAcesso: [this.logAcesso.tipoLogAcesso ?? ""],
      nomeUsuario: [this.logAcesso?.usuario.nomeUsuario ?? ""],
      emailUsuario: [this.logAcesso?.usuario.email ?? ""],
      createdAt: [this.logAcesso?.createdAt ?? ""]
    });

    if (this.viewMode == true) {
      this.form.disable();
    }
  }
}
