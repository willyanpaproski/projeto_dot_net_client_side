import { Component, Injector, OnInit } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { CommonModule } from '@angular/common';
import { CampoFiltro, FiltroDataTableComponent } from '../../shared/filtro-data-table/filtro-data-table/filtro-data-table.component';
import { ModalComponent } from '../../modal/modal.component';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../shared/notification/notification.service';
import { formatarComMascara, formatDateTime, formatGenericValue } from '../../shared/utils/formatters';
import { FECHAR_MODAL, LOG_ACESSO_DATA, LogsAcessosVisualizacaoComponent, VIEW_MODE } from '../logs-acessos-visualizacao/logs-acessos-visualizacao.component';
import { formatarOperadoresFiltroAplicado, pegarLabelFiltroAplicado } from '../../shared/utils/filterComponentHelpers';

@Component({
  selector: 'app-logs-acessos-listagem',
  imports: [
    DataTableComponent,
    CommonModule,
    FiltroDataTableComponent,
    ModalComponent
  ],
  templateUrl: './logs-acessos-listagem.component.html',
  styleUrl: './logs-acessos-listagem.component.css'
})
export class LogsAcessosListagemComponent implements OnInit {
  displayedColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'tipoLogAcesso', label: 'Tipo do Log', width: '100px' },
    { key: 'usuario.nomeUsuario', label: 'Nome do Usuário', width: '200px' },
    { key: 'usuario.email', label: 'Email do Usuário', width: '200px' },
    { key: 'createdAt', label: 'Horário de Acesso', width: '150px', format: formatDateTime }
  ];

  camposFiltro: CampoFiltro[] = [
    { label: 'ID', value: 'id', tipo: 'number' },
    { label: 'Nome do Usuário', value: 'usuario.nomeUsuario', tipo: 'string' },
    { label: 'Email do Usuário', value: 'usuario.email', tipo: 'string' },
    { label: 'Horário de Acesso', value: 'createdAt', tipo: 'string' }
  ];

  filtrosAtivos: any[] = [];
  dataSource: any[] = [];
  selectedRow: any = null;
  modalComponent: any;
  modalTitle = '';
  showModal = false;
  modalInjector: Injector | undefined;

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private injector: Injector,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.carregarLogsAcesso();
  }

  carregarLogsAcesso(filtros?: any[]): void
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
        $nomeUsuario: String, $nomeUsuarioOperador: FiltroOperador,
        $emailUsuario: String, $emailUsuarioOperador: FiltroOperador,
        $createdAt: String, $createdAtOperador: FiltroOperador
      ) {
        logAcessoQuery {
          pegarTodosLogsAcessoComUsuario(
            id: $id, idOperador: $idOperador,
            nomeUsuario: $nomeUsuario, nomeUsuarioOperador: $nomeUsuarioOperador,
            emailUsuario: $emailUsuario, emailUsuarioOperador: $emailUsuarioOperador,
            createdAt: $createdAt, createdAtOperador: $createdAtOperador
          ) {
            id
            tipoLogAcesso
            usuario {
              nomeUsuario
              email
            }
            createdAt
          }
        }
      }
    `;

    console.log(query);

    this.apollo
      .watchQuery<any>({
        query,
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .subscribe({
        next: (result) => {
          this.dataSource = [...result.data.logAcessoQuery.pegarTodosLogsAcessoComUsuario]
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

    this.carregarLogsAcesso(this.filtrosAtivos);
  }

  limparFiltros(): void {
    this.filtrosAtivos = [];
    this.carregarLogsAcesso();
  }

  abrirModalVisualizacao(item?: any): void
  {
    const id = item?.id;
    if (!id) return;

    this.http.get(`http://localhost:5250/api/logAcesso/logsAcessoComUsuario/${id}`).subscribe({
      next: (logAcesso: any) => {
        this.modalTitle = 'Visualizar Log de Acesso';
        this.modalComponent = LogsAcessosVisualizacaoComponent;
        this.showModal = true;
        this.modalInjector = Injector.create({
          providers: [
            { provide: LOG_ACESSO_DATA, useValue: logAcesso },
            { provide: FECHAR_MODAL, useValue: this.fecharModal.bind(this) },
            { provide: VIEW_MODE, useValue: true }
          ],
          parent: this.injector
        });
      }
    });
  }

  fecharModal(): void {
    this.showModal = false;
    this.modalInjector = undefined;
    this.selectedRow = null;
    this.carregarLogsAcesso();
  }

  onRowClick(row: any): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  removerFiltro(index: number): void {
    this.filtrosAtivos.splice(index, 1);
    this.carregarLogsAcesso(this.filtrosAtivos);
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
