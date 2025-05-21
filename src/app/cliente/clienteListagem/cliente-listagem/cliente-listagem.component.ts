import { Component, OnInit } from '@angular/core';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { Apollo, gql } from 'apollo-angular';
import {
  formatBoolean,
  formatDate,
  formatDateTime,
  formatCep,
  formatCelular,
  formatCpfCnpj
} from '../../../shared/utils/formatters';
import { ClienteCadastroComponent } from '../../clienteCadastro/cliente-cadastro/cliente-cadastro.component';
import { ModalComponent } from '../../../modal/modal.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { CLIENTE_DATA, FECHAR_MODAL } from '../../clienteCadastro/cliente-cadastro/cliente-cadastro.component';
import { NotificationService } from '../../../shared/notification.service';

@Component({
  selector: 'app-cliente-listagem',
  imports: [DataTableComponent, ModalComponent, CommonModule],
  templateUrl: './cliente-listagem.component.html',
  styleUrl: './cliente-listagem.component.css'
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
    { key: 'cep', label: 'CEP', width: '150px', format: formatCep },
    { key: 'endereco', label: 'Endereço', with: '200px' },
    { key: 'cidade', label: 'Cidade', width: '100px' },
    { key: 'bairro', label: 'Bairro', width: '100px' },
    { key: 'rua', label: 'Rua', width: '200px' },
    { key: 'estado', label: 'Estado', width: '100px' },
    { key: 'createdAt', label: 'Criado em', width: '150px', format: formatDateTime },
    { key: 'updatedAt', label: 'Atualizado em', width: '150px', format: formatDateTime }
  ];

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

  carregarClientes(): void {
    const query = gql`
      query {
        clienteQuery {
          pegarClientes {
            id
            ativo
            nome
            cpfCnpj
            dataNascimento
            tipoPessoa
            telefone
            celular
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
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .subscribe({
        next: (result) => {
          this.dataSource = [...result.data.clienteQuery.pegarClientes]
        },
        error: (err) => {
          console.error('Erro Apollo GraphQL:', err);
        }
      });
  }

  abrirModalEdicao(item: any): void {
    const id = item?.id;
    if (!id) return;

    this.http.get(`http://localhost:5250/api/cliente/${id}`).subscribe({
      next: (cliente: any) => {
        this.modalTitle = 'Editar Cliente',
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
      error: (error) => {
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
}
