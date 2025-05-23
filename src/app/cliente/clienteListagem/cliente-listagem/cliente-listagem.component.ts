import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { Apollo, gql } from 'apollo-angular';
import {
  formatBoolean,
  formatDate,
  formatDateTime,
  formatCep,
  formatCelular,
  formatCpfCnpj,
  formatGenericValue,
  formatarComMascara
} from '../../../shared/utils/formatters';
import { ClienteCadastroComponent } from '../../clienteCadastro/cliente-cadastro/cliente-cadastro.component';
import { ModalComponent } from '../../../modal/modal.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { CLIENTE_DATA, FECHAR_MODAL } from '../../clienteCadastro/cliente-cadastro/cliente-cadastro.component';
import { NotificationService } from '../../../shared/notification/notification.service';
import { CampoFiltro, FiltroDataTableComponent } from '../../../shared/filtro-data-table/filtro-data-table/filtro-data-table.component';
import { formatarOperadoresFiltroAplicado, pegarLabelFiltroAplicado } from '../../../shared/utils/filterComponentHelpers';

@Component({
  selector: 'app-cliente-listagem',
  standalone: true,
  imports: [
    DataTableComponent,
    ModalComponent,
    CommonModule,
    FiltroDataTableComponent
  ],
  templateUrl: './cliente-listagem.component.html',
  styleUrls: ['./cliente-listagem.component.css']
})
export class ClienteListagemComponent implements OnInit {
  displayedColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'ativo', label: 'Ativo', width: '80px', format: formatBoolean },
    { key: 'nome', label: 'Nome', width: '200px' },
    { key: 'cpfCnpj', label: 'CPF/CNPJ', width: '200px', format: formatCpfCnpj },
    { key: 'dataNascimento', label: 'Data de Nascimento', width: '200px', format: formatDate },
    { key: 'tipoPessoa', label: 'Tipo de Pessoa', width: '100px' },
    { key: 'telefone', label: 'Telefone', width: '150px', format: formatCelular },
    { key: 'celular', label: 'Celular', width: '150px', format: formatCelular },
    { key: 'email', label: 'Email', width: '200px' },
    { key: 'cep', label: 'CEP', width: '150px', format: formatCep },
    { key: 'endereco', label: 'Endereço', width: '200px' },
    { key: 'cidade', label: 'Cidade', width: '100px' },
    { key: 'bairro', label: 'Bairro', width: '100px' },
    { key: 'rua', label: 'Rua', width: '200px' },
    { key: 'estado', label: 'Estado', width: '100px' },
    { key: 'createdAt', label: 'Criado em', width: '150px', format: formatDateTime },
    { key: 'updatedAt', label: 'Atualizado em', width: '150px', format: formatDateTime }
  ];

  camposFiltro: CampoFiltro[] = [
    { label: 'ID', value: 'id', tipo: 'number' },
    { label: 'Ativo', value: 'ativo', tipo: 'boolean' },
    { label: 'Nome', value: 'nome', tipo: 'string' },
    { label: 'CPF/CNPJ', value: 'cpfCnpj', tipo: 'string' },
    { label: 'Data de Nascimento', value: 'dataNascimento', tipo: 'date' },
    { label: 'Telefone', value: 'telefone', tipo: 'string', mascara: '(00) 00000-0000' },
    { label: 'Celular', value: 'celular', tipo: 'string', mascara: '(00) 00000-0000' },
    { label: 'Email', value: 'email', tipo: 'string' },
    { label: 'CEP', value: 'cep', tipo: 'string', mascara: '00000-000' },
    { label: 'Endereco', value: 'endereco', tipo: 'string' },
    { label: 'Cidade', value: 'cidade', tipo: 'string' },
    { label: 'Bairro', value: 'bairro', tipo: 'string' },
    { label: 'Rua', value: 'rua', tipo: 'string' },
    { label: 'Estado', value: 'estado', tipo: 'string' },
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
    this.carregarClientes();
  }

  carregarClientes(filtros?: any[]): void {
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
      $nome: String, $nomeOperador: FiltroOperador,
      $cpfCnpj: String, $cpfCnpjOperador: FiltroOperador,
      $dataNascimento: String, $dataNascimentoOperador: FiltroOperador,
      $telefone: String, $telefoneOperador: FiltroOperador,
      $celular: String, $celularOperador: FiltroOperador,
      $email: String, $emailOperador: FiltroOperador,
      $cep: String, $cepOperador: FiltroOperador,
      $endereco: String, $enderecoOperador: FiltroOperador,
      $cidade: String, $cidadeOperador: FiltroOperador,
      $bairro: String, $bairroOperador: FiltroOperador,
      $rua: String, $ruaOperador: FiltroOperador,
      $estado: String, $estadoOperador: FiltroOperador,
      $createdAt: String, $createdAtOperador: FiltroOperador,
      $updatedAt: String, $updatedAtOperador: FiltroOperador
      ) {
        clienteQuery {
          pegarClientes(
            id: $id,
            idOperador: $idOperador,
            ativo: $ativo,
            ativoOperador: $ativoOperador,
            nome: $nome,
            nomeOperador: $nomeOperador,
            cpfCnpj: $cpfCnpj,
            cpfCnpjOperador: $cpfCnpjOperador,
            dataNascimento: $dataNascimento,
            dataNascimentoOperador: $dataNascimentoOperador,
            telefone: $telefone,
            telefoneOperador: $telefoneOperador,
            celular: $celular,
            celularOperador: $celularOperador,
            email: $email,
            emailOperador: $emailOperador,
            cep: $cep,
            cepOperador: $cepOperador,
            endereco: $endereco,
            enderecoOperador: $enderecoOperador,
            cidade: $cidade,
            cidadeOperador: $cidadeOperador,
            bairro: $bairro,
            bairroOperador: $bairroOperador,
            rua: $rua,
            ruaOperador: $ruaOperador,
            estado: $estado,
            estadoOperador: $estadoOperador,
            createdAt: $createdAt,
            createdAtOperador: $createdAtOperador,
            updatedAt: $updatedAt,
            updatedAtOperador: $updatedAtOperador
          ) {
            id
            ativo
            nome
            cpfCnpj
            dataNascimento
            tipoPessoa
            telefone
            celular
            email
            cep
            endereco
            cidade
            bairro
            rua
            estado
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
          this.dataSource = [...result.data.clienteQuery.pegarClientes];
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

    this.carregarClientes(this.filtrosAtivos);
  }

  limparFiltros(): void {
    this.filtrosAtivos = [];
    this.carregarClientes();
  }

  abrirModalEdicao(item: any): void {
    const id = item?.id;
    if (!id) return;

    this.http.get(`http://localhost:5250/api/cliente/${id}`).subscribe({
      next: (cliente: any) => {
        this.modalTitle = 'Editar Cliente';
        this.modalComponent = ClienteCadastroComponent;
        this.showModal = true;
        this.modalInjector = Injector.create({
          providers: [
            { provide: CLIENTE_DATA, useValue: cliente },
            { provide: FECHAR_MODAL, useValue: this.fecharModal.bind(this) }
          ],
          parent: this.injector
        });
      },
      error: (error) => {
        console.error(`Erro ao buscar cliente: `, error);
      }
    });
  }

  deletar(item: any): void {
    const id = item?.id;
    if (!id) return;

    this.http.delete(`http://localhost:5250/api/cliente/${id}`).subscribe({
      next: () => {
        this.notificationService.show('Cliente deletado com sucesso!', 'success');
        this.carregarClientes();
      },
      error: () => {
        this.notificationService.show('Erro ao deletar cliente!', 'error');
      }
    });
  }

  abrirModalNovoCliente(): void {
    this.modalTitle = 'Novo Cliente';
    this.modalComponent = ClienteCadastroComponent;
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
    this.carregarClientes();
  }

  onRowClick(row: any): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  removerFiltro(index: number): void {
    this.filtrosAtivos.splice(index, 1);
    this.carregarClientes(this.filtrosAtivos);
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
