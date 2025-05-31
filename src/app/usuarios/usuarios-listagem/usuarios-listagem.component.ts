import { Component, Injector, OnInit } from '@angular/core';
import { DataTableComponent } from '../../shared/data-table/data-table.component';
import { ModalComponent } from '../../modal/modal.component';
import { CommonModule } from '@angular/common';
import { CampoFiltro, FiltroDataTableComponent } from '../../shared/filtro-data-table/filtro-data-table/filtro-data-table.component';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../shared/notification/notification.service';
import { formatarComMascara, formatBoolean, formatDateTime, formatGenericValue } from '../../shared/utils/formatters';
import { FECHAR_MODAL, USUARIO_DATA, UsuariosCadastroComponent } from '../usuarios-cadastro/usuarios-cadastro.component';
import { formatarOperadoresFiltroAplicado, pegarLabelFiltroAplicado } from '../../shared/utils/filterComponentHelpers';

@Component({
  selector: 'app-usuarios-listagem',
  standalone: true,
  imports: [
    DataTableComponent,
    ModalComponent,
    CommonModule,
    FiltroDataTableComponent
  ],
  templateUrl: './usuarios-listagem.component.html',
  styleUrl: './usuarios-listagem.component.css'
})
export class UsuariosListagemComponent implements OnInit {
  displayedColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'ativo', label: 'Ativo', width: '80px', format: formatBoolean },
    { key: 'nomeUsuario', label: 'Nome do usuário', width: '200px' },
    { key: 'email', label: 'Email', width: '200px' },
    { key: 'lastLoggedIn', label: 'Último Acesso', width: '150px', format: formatDateTime },
    { key: 'createdAt', label: 'Criado em', width: '150px', format: formatDateTime },
    { key: 'updatedAt', label: 'Atualizado em', width: '150px', format: formatDateTime }
  ];

  camposFiltro: CampoFiltro[] = [
    { label: 'ID', value: 'id', tipo: 'number' },
    { label: 'Ativo', value: 'ativo', tipo: 'boolean' },
    { label: 'Email', value: 'email', tipo: 'string' },
    { label: 'Nome do usuário', value: 'nomeUsuario', tipo: 'string' },
    { label: 'Último Acesso', value: 'lastLoggedIn', tipo: 'string' },
    { label: 'Criado em', value: 'createdAt', tipo: 'string' },
    { label: 'Atualizado em', value: 'updatedAt', tipo: 'string' }
  ];

  filtrosAtivos: any[] = [];
  dataSource: any[] = [];
  showModal = false;
  modalTitle = '';
  modalComponent: any;
  modalInjector: Injector | undefined;
  selectedRow: any = null;

  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private injector: Injector,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(filtros?: any[]): void {
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
      query (
        $id: Long, $idOperador: FiltroOperador,
        $ativo: Boolean, $ativoOperador: FiltroOperador,
        $email: String, $emailOperador: FiltroOperador,
        $nomeUsuario: String, $nomeUsuarioOperador: FiltroOperador,
        $lastLoggedIn: String, $lastLoggedInOperador: FiltroOperador,
        $createdAt: String, $createdAtOperador: FiltroOperador,
        $updatedAt: String, $updatedAtOperador: FiltroOperador
      ) {
        usuarioQuery {
          pegarUsuarios(
            id: $id, idOperador: $idOperador,
            ativo: $ativo, ativoOperador: $ativoOperador,
            email: $email, emailOperador: $emailOperador,
            nomeUsuario: $nomeUsuario, nomeUsuarioOperador: $nomeUsuarioOperador,
            lastLoggedIn: $lastLoggedIn, lastLoggedInOperador: $lastLoggedInOperador,
            createdAt: $createdAt, createdAtOperador: $createdAtOperador,
            updatedAt: $updatedAt, updatedAtOperador: $updatedAtOperador
          ) {
            id
            ativo
            nomeUsuario
            email
            lastLoggedIn
            createdAt
            updatedAt
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
          this.dataSource = [...result.data.usuarioQuery.pegarUsuarios];
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

    this.carregarUsuarios(this.filtrosAtivos);
  }

  limparFiltros(): void {
    this.filtrosAtivos = [];
    this.carregarUsuarios();
  }

  abrirModalEdicao(item?: any): void {
    const id = item?.id;
    if (!id) return;

    this.http.get(`http://localhost:5250/api/usuario/${id}`).subscribe({
      next: (usuario: any) => {
        this.modalTitle = 'Editar Usuário';
        this.modalComponent = UsuariosCadastroComponent;
        this.showModal = true;
        this.modalInjector = Injector.create({
          providers: [
            { provide: FECHAR_MODAL, useValue: this.fecharModal.bind(this) },
            { provide: USUARIO_DATA, useValue: usuario }
          ],
          parent: this.injector
        });
      },
      error: () => {
        this.notificationService.show('Erro ao editar usuário', 'error');
      }
    });
  }

  deletar(item?: any): void {
    const id = item?.id;
    if (!id) return;

    this.http.delete(`http://localhost:5250/api/usuario/${id}`).subscribe({
      next: () => {
        this.notificationService.show('Usuário deletado com sucesso!', 'success');
        this.carregarUsuarios();
      },
      error: () => {
        this.notificationService.show('Erro ao deletar usuário', 'error');
      }
    });
  }

  abrirModalNovoUsuario(): void {
    this.modalTitle = 'Novo Usuário';
    this.modalComponent = UsuariosCadastroComponent;
    this.showModal = true;
    this.modalInjector = Injector.create({
      providers: [
        { provide: FECHAR_MODAL, useValue: this.fecharModal.bind(this) }
      ],
      parent: this.injector
    });
  }

  fecharModal(): void {
    this.showModal = false;
    this.modalInjector = undefined;
    this.selectedRow = null;
    this.carregarUsuarios();
  }

  onRowClick(row: any): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  removerFiltro(index: number): void {
    this.filtrosAtivos.splice(index, 1);
    this.carregarUsuarios(this.filtrosAtivos);
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
