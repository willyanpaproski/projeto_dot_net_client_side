import { Component, OnInit } from '@angular/core';
import {
  formatBoolean,
  formatDateTime,
  formatCep,
  formatCelular,
  formatCpfCnpj
} from '../../../shared/utils/formatters';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { Apollo, gql } from 'apollo-angular';
import { FilialCadastroComponent } from '../../filialCadastro/filial-cadastro/filial-cadastro.component';
import { ModalComponent } from '../../../modal/modal.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';
import { FILIAL_DATA } from '../../filialCadastro/filial-cadastro/filial-cadastro.component';

@Component({
  selector: 'app-filial-listagem',
  imports: [DataTableComponent, ModalComponent, CommonModule],
  templateUrl: './filial-listagem.component.html',
  styleUrl: './filial-listagem.component.css'
})
export class FilialListagemComponent implements OnInit {
  displayedColumns = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'ativo', label: 'Ativo', width: '80px', format: formatBoolean },
    { key: 'nome', label: 'Nome', width: '200px' },
    { key: 'cnpj', label: 'CNPJ', width: '200px', format: formatCpfCnpj },
    { key: 'cep', label: 'CEP', width: '150px', format: formatCep },
    { key: 'endereco', label: 'Endereço', width: '200px' },
    { key: 'numero', label: 'Número', width: '80px' },
    { key: 'rua', label: 'Rua', width: '200px' },
    { key: 'cidade', label: 'Cidade', width: '150px' },
    { key: 'estado', label: 'Estado', width: '80px' },
    { key: 'bairro', label: 'Bairro', width: '200px' },
    { key: 'telefone', label: 'Telefone', width: '150px', format: formatCelular },
    { key: 'celular', label: 'Celular', width: '150px', format: formatCelular },
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

  constructor(private apollo: Apollo, private http: HttpClient, private injector: Injector) {}

  ngOnInit(): void {
    this.carregarFiliais();
  }

  carregarFiliais(): void {
    const query = gql`
      query {
        filialQuery {
          pegarFiliais {
            id
            ativo
            nome
            cnpj
            cep
            endereco
            numero
            rua
            cidade
            estado
            bairro
            telefone
            celular
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
          this.dataSource = [...result.data.filialQuery.pegarFiliais]
        },
        error: (err) => {
          console.error('Erro Apollo GraphQL:', err);
        }
      });
  }

  abrirModalEdicao(item: any): void {
    const id = item?.id;
    if (!id) return;

    this.http.get(`http://localhost:5250/api/filial/${id}`).subscribe({
      next: (filial: any) => {
        this.modalTitle = 'Editar Filial';
        this.modalComponent = FilialCadastroComponent;
        this.showModal = true;
        this.modalInjector = Injector.create({
          providers: [
            { provide: FILIAL_DATA, useValue: filial }
          ],
          parent: this.injector
        });
      },
      error: (error) => {
        console.error('Erro ao buscar filial: ', error);
      }
    });
  }

  abrirModalNovaFilial(): void {
    this.modalTitle = 'Nova Empresa';
    this.modalComponent = FilialCadastroComponent;
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.modalInjector = undefined;
    this.selectedRow = null;
    this.carregarFiliais();
  }

  onRowClick(row: any): void {
    this.selectedRow = row;
  }
}
