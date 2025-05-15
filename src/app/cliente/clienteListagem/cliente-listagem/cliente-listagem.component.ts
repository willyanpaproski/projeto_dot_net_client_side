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

@Component({
  selector: 'app-cliente-listagem',
  imports: [DataTableComponent, ModalComponent, CommonModule, ClienteCadastroComponent],
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

  constructor(private apollo: Apollo) {}

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

  abrirModalNovoCliente(): void {
    this.modalTitle = 'Novo Cliente';
    this.modalComponent = ClienteCadastroComponent;
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.carregarClientes();
  }

}
