import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type CampoTipo = 'string' | 'number' | 'boolean' | 'date';

export interface CampoFiltro {
  label: string;
  value: string;
  tipo: CampoTipo;
}

@Component({
  selector: 'app-filtro-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro-data-table.component.html',
  styleUrls: ['./filtro-data-table.component.css']
})
export class FiltroDataTableComponent implements OnChanges {
  @Input() campos: CampoFiltro[] = [];
  @Input() quantidadeMaximaFiltros = 4;
  @Input() filtrosAtivos: any[] = [];
  @Output() filtroAplicado = new EventEmitter<any>();
  @Output() filtrosLimpos = new EventEmitter<void>();
  @Output() filtroExcedido = new EventEmitter<void>();

  campoSelecionado: CampoFiltro | null = null;
  operadorSelecionado: string = '';
  valor: any = '';

  operadoresPorTipo: Record<CampoTipo, string[]> = {
    string: ['IGUAL', 'DIFERENTE', 'CONTEM', 'NAO_CONTEM', 'COMECA_COM', 'TERMINA_COM'],
    number: ['IGUAL', 'DIFERENTE', 'MAIOR_QUE', 'MENOR_QUE', 'MAIOR_IGUAL', 'MENOR_IGUAL'],
    boolean: ['IGUAL', 'DIFERENTE'],
    date: ['IGUAL', 'DIFERENTE', 'MAIOR_QUE', 'MENOR_QUE', 'MAIOR_IGUAL', 'MENOR_IGUAL']
  };

  get operadoresDisponiveis(): string[] {
    return this.campoSelecionado
      ? this.operadoresPorTipo[this.campoSelecionado.tipo]
      : [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campos'] && this.campos.length > 0 && !this.campoSelecionado) {
      this.campoSelecionado = this.campos[0];
      this.operadorSelecionado = this.operadoresPorTipo[this.campoSelecionado.tipo][0];
    }
  }

  aplicarFiltro(): void {
    if (!this.campoSelecionado || !this.operadorSelecionado) return;
    const tipo = this.campoSelecionado.tipo;

    const valorEhValido =
      tipo === 'boolean' || (this.valor !== null && this.valor !== undefined && this.valor !== '');

    if (tipo === 'boolean' && this.valor === '') {
      this.valor = true;
    }

    if (tipo === 'date' && this.valor) {
      const data = new Date(this.valor);
      if (!isNaN(data.getTime())) {
        this.valor = data.toISOString().split('T')[0];
      }
    }

    if (!valorEhValido) return;

    const filtro = {
      campo: this.campoSelecionado.value,
      operador: this.operadorSelecionado,
      valor: this.valor,
      tipo: tipo
    };

    const jaExiste = this.filtrosAtivos.find(f => f.campo === filtro.campo);
    const total = jaExiste ? this.filtrosAtivos.length : this.filtrosAtivos.length + 1;

    if (total > this.quantidadeMaximaFiltros) {
      this.filtroExcedido.emit();
      return;
    }

    this.filtroAplicado.emit(filtro);
  }

  limparFiltros(): void {
    this.campoSelecionado = this.campos.length > 0 ? this.campos[0] : null;
    this.operadorSelecionado = this.campoSelecionado
      ? this.operadoresPorTipo[this.campoSelecionado.tipo][0]
      : '';
    this.valor = '';
    this.filtrosLimpos.emit();
  }

  onCampoSelecionadoChange(): void {
  this.valor = '';

  if (this.campoSelecionado) {
    this.operadorSelecionado = this.operadoresPorTipo[this.campoSelecionado.tipo][0];
  } else {
    this.operadorSelecionado = '';
  }
}
}
