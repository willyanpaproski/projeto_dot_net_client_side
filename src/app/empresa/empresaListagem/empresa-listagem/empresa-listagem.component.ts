import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { Apollo, gql } from 'apollo-angular';
import {
  formatBoolean,
  formatDateTime,
  formatCep,
  formatCelular,
  formatCpfCnpj
} from '../../../shared/utils/formatters';
import { EmpresaCadastroComponent } from '../../empresaCadastro/empresa-cadastro/empresa-cadastro.component';
import { ModalComponent } from '../../../modal/modal.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { EMPRESA_DATA, FECHAR_MODAL } from '../../empresaCadastro/empresa-cadastro/empresa-cadastro.component';
import { NotificationService } from '../../../shared/notification/notification.service';

@Component({
  selector: 'app-empresa-listagem',
  imports: [DataTableComponent, ModalComponent, CommonModule],
  templateUrl: './empresa-listagem.component.html',
  styleUrl: './empresa-listagem.component.css'
})
export class EmpresaListagemComponent implements OnInit {
  @Output() selecionar = new EventEmitter<any>();

  displayedColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'ativo', label: 'Ativo', width: '80px', format: formatBoolean },
    { key: 'razaoSocial', label: 'Razão Social', width: '200px' },
    { key: 'nomeFantasia', label: 'Nome Fantasia', width: '200px' },
    { key: 'cnpj', label: 'Cnpj', width: '200px', format: formatCpfCnpj },
    { key: 'cep', label: 'CEP', width: '150px', format: formatCep },
    { key: 'endereco', label: 'Endereço', width: '200px' },
    { key: 'numero', label: 'Número', width: '80px' },
    { key: 'cidade', label: 'Cidade', width: '150px' },
    { key: 'bairro', label: 'Bairro', width: '200px' },
    { key: 'rua', label: 'Rua', width: '200px' },
    { key: 'telefone', label: 'Telefone', width: '150px', format: formatCelular },
    { key: 'email', label: 'Email', width: '200px' },
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
    private notificationService: NotificationService,
    @Inject('MODO_SELECAO') @Optional() public modoSelecao: boolean = false,
    @Inject('SELECT_HANDLER') @Optional() public selectHandler: ((item: any) => void) | null = null
  ) {}

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  carregarEmpresas(): void
  {
    const query = gql`
      query {
        empresaQuery {
          pegarEmpresas {
            id
            ativo
            razaoSocial
            nomeFantasia
            cnpj
            cep
            endereco
            numero
            cidade
            bairro
            rua
            telefone
            email
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
          this.dataSource = [...result.data.empresaQuery.pegarEmpresas]
        },
        error: (err) => {
          console.error('Erro Apollo GraphQL:', err);
        }
      });
  }

  abrirModalEdicao(item: any): void {
    const id = item?.id;
    if (!id) return;

    this.http.get(`http://localhost:5250/api/empresa/${id}`).subscribe({
      next: (empresa: any) => {
        this.modalTitle = 'Editar Empresa';
        this.modalComponent = EmpresaCadastroComponent;
        this.showModal = true;
        this.modalInjector = Injector.create({
          providers: [
            { provide: EMPRESA_DATA, useValue: empresa },
            { provide: FECHAR_MODAL, useValue: this.fecharModal.bind(this) }
          ],
          parent: this.injector
        });
      },
      error: (error) => {
        console.error('Erro ao buscar empresa: ', error);
      }
    });
  }

  deletar(item: any): void {
    const id = item?.id;
    if (!id) return;

    this.http.delete(`http://localhost:5250/api/empresa/${id}`).subscribe({
      next: () => {
        this.notificationService.show('Empresa deletada com sucesso!', 'success');
        this.carregarEmpresas();
      },
      error: (error) => {
        this.notificationService.show(error?.error, 'error');
      }
    });
  }

  abrirModalNovaEmpresa(): void {
    this.modalTitle = 'Nova Empresa';
    this.modalComponent = EmpresaCadastroComponent;
    this.showModal = true;
    this.modalInjector = Injector.create({
      providers: [
        { provide: FECHAR_MODAL, useValue: this.fecharModal.bind(this) }
      ]
    });
  }

  fecharModal(): void {
    this.showModal = false;
    this.modalInjector = undefined;
    this.selectedRow = null;
    this.carregarEmpresas();
  }

  onRowClick(row: any): void {
    this.selectedRow = this.selectedRow === row ? null : row;
  }

  onRowDoubleClick(row: any): void {
    this.selectedRow = row;

    if (this.modoSelecao && this.selectHandler) {
      this.selectHandler(row);
    } else {
      this.abrirModalEdicao(row);
    }
  }
}
