import { CommonModule } from '@angular/common';
import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

export const VIEW_MODE = new InjectionToken<any>('VIEW_MODE');
export const LOG_DATA = new InjectionToken<any>('LOG_DATA');
export const FECHAR_MODAL = new InjectionToken<any>('FECHAR_MODAL');

@Component({
  selector: 'app-logs-usuarios-visualizacao',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './logs-usuarios-visualizacao.component.html',
  styleUrl: './logs-usuarios-visualizacao.component.css'
})
export class LogsUsuariosVisualizacaoComponent implements OnInit {
  log = inject(LOG_DATA, { optional: true });
  fecharModal = inject(FECHAR_MODAL, { optional: true });
  viewMode = inject(VIEW_MODE, { optional: true });
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.log?.id ?? null],
      tabela: [this.log?.tabela ?? ''],
      tipoLog: [this.log?.tipoLog ?? ''],
      usuario: [this.log?.usuario ?? ''],
      campos: [this.log?.campos ?? ''],
      createdAt: [this.log?.createdAt ?? '']
    });

    if (this.viewMode == true) {
      this.form.disable();
    }
  }
}
