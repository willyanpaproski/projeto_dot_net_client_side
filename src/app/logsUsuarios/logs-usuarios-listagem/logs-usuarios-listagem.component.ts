import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { formatarComMascara, formatDateTime, formatGenericValue } from '../../shared/utils/formatters';
import { Apollo, gql } from 'apollo-angular';
import { NotificationService } from '../../shared/notification/notification.service';
import { formatarOperadoresFiltroAplicado, pegarLabelFiltroAplicado } from '../../shared/utils/filterComponentHelpers';
import { CampoFiltro, FiltroDataTableComponent } from '../../shared/filtro-data-table/filtro-data-table/filtro-data-table.component';

@Component({
  selector: 'app-logs-usuarios-listagem',
  standalone: true,
  imports: [
    DataTableComponent,
    CommonModule,
    FiltroDataTableComponent
  ],
  templateUrl: './logs-usuarios-listagem.component.html',
  styleUrl: './logs-usuarios-listagem.component.css'
})
export class LogsUsuariosListagemComponent implements OnInit {
  displayedColumns = [
    { key: "id", label: "ID", width: "80px" },
    { key: "tabela", label: "Tabela", width: "100px" },
    { key: "tipoLog", label: "Tipo do Log", width: "100px" },
    { key: "usuario", label: "Usuário", width: "150px" },
    { key: "campos", label: "Campos", width: "200px" },
    { key: "createdAt", label: "Horário de execução", width: "150px", format: formatDateTime }
  ];

  camposFiltro: CampoFiltro[] = [
    { label: "ID", value: "id", tipo: "number" },
    { label: "Tabela", value: "tabela", tipo: "string" },
    { label: "Usuário", value: "usuario", tipo: "string" },
    { label: "Campos", value: "campos", tipo: "string" },
    { label: "Hora de execução", value: "createdAt", tipo: "string" }
  ];

  filtrosAtivos: any[] = [];
  dataSource: any[] = [];
  selectedRow: any = null;

  constructor(
    private apollo: Apollo,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.carregarLogs();
  }

  carregarLogs(filtros?: any[]): void
  {
    const filtroArgs: any = {};

    filtros?.forEach(filtro => {
      if (filtro.campo === 'id') {
        filtroArgs[filtro.campo] = Number(filtro.valor);
      } else {
        filtroArgs[filtro.campo] = filtro.valor;
      }
      filtroArgs[`${filtro.campo}Operador`] = filtro.operador;
    });

    const query = gql`
      query(
        $id: Long, $idOperador: FiltroOperador,
        $tabela: String, $tabelaOperador: FiltroOperador,
        $usuario: String, $usuarioOperador: FiltroOperador,
        $campos: String, $camposOperador: FiltroOperador,
        $createdAt: String, $createdAtOperador: FiltroOperador
      ) {
        logQuery {
          pegarLogs(
            id: $id,
            idOperador: $idOperador,
            tabela: $tabela,
            tabelaOperador: $tabelaOperador,
            usuario: $usuario,
            usuarioOperador: $usuarioOperador,
            campos: $campos,
            camposOperador: $camposOperador,
            createdAt: $createdAt,
            createdAtOperador: $createdAtOperador
          ) {
            id
            tabela
            tipoLog
            usuario
            campos
            createdAt
          }
        }
      }
    `;

    this.apollo
      .watchQuery<any>({
        query,
        variables: filtroArgs,
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .subscribe({
        next: (result) => {
          this.dataSource = [...result.data.logQuery.pegarLogs];
        },
        error: (err) => {
          console.error('Erro Apollo GraphQL:', err);
        }
      });
  }

  aplicarFiltro(filtro: any): void {
    const index = this.filtrosAtivos.findIndex(f => f.campo === filtro.campo);

    if (index > -1) {
      this.filtrosAtivos[index] = filtro;
    } else {
      this.filtrosAtivos.push(filtro);
    }

    this.carregarLogs(this.filtrosAtivos);
  }

  limparFiltros(): void {
    this.filtrosAtivos = [];
    this.carregarLogs();
  }

  onRowClick(row: any): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  removerFiltro(index: number): void {
    this.filtrosAtivos.splice(index, 1);
    this.carregarLogs(this.filtrosAtivos);
  }

  onFiltroExcedido(): void {
    this.notificationService.show('Limite de 4 filtros atingido!', 'warning');
  }

  pegarLabel(campo: any): string {
    return pegarLabelFiltroAplicado(campo, this.camposFiltro)
  }

  formatarOperador(operador: any): string {
    return formatarOperadoresFiltroAplicado(operador);
  }

  formatarValor(valor: any, tipo: string, campo: string): string {
    const campoDefinido = this.camposFiltro.find(f => f.value === campo);

    if (campoDefinido?.mascara) {
      return formatarComMascara(valor, campoDefinido.mascara);
    }

    return formatGenericValue(valor, tipo)
  }
}
