import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { ClienteCadastroComponent } from '../cliente/clienteCadastro/cliente-cadastro/cliente-cadastro.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ClienteListagemComponent } from '../cliente/clienteListagem/cliente-listagem/cliente-listagem.component';
import { EmpresaListagemComponent } from '../empresa/empresaListagem/empresa-listagem/empresa-listagem.component';
import { FilialListagemComponent } from '../filial/filialListagem/filial-listagem/filial-listagem.component';
import { LogsUsuariosListagemComponent } from '../logsUsuarios/logs-usuarios-listagem/logs-usuarios-listagem.component';
import { UsuariosListagemComponent } from '../usuarios/usuarios-listagem/usuarios-listagem.component';

interface SidebarItem {
  label: string;
  icon?: string;
  routeLink?: string;
  component?: any; // qualquer componente, sem restrição de assinatura do construtor
  children?: SidebarItem[];
}

@Component({
  selector: 'app-left-sidebar',
  imports: [CommonModule, RouterModule, ModalComponent],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent {
  @Input() isLeftSidebarCollapsed: boolean = false;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();

  selectedModule: string | null = null;
  showModal = false;
  modalTitle: string = '';
  modalComponent: any; // para aceitar qualquer componente sem erro de tipo

  toggleColapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed);
  }

  toggleModule(label: string) {
    this.selectedModule = this.selectedModule === label ? null : label;
  }

  openModal(component: any, title: string) {
    this.modalComponent = component;
    this.modalTitle = title;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  items: SidebarItem[] = [
    {
      routeLink: 'dashboard',
      icon: 'pi pi-home',
      label: 'Dashboard',
      component: DashboardComponent
    },
    {
      label: 'Cadastros',
      icon: 'pi pi-list-check',
      children: [
        { label: 'Clientes', routeLink: 'clientes', component: ClienteListagemComponent },
        { label: 'Empresas', routeLink: 'empresas', component: EmpresaListagemComponent },
        { label: 'Filiais', routeLink: 'filiais', component: FilialListagemComponent },
        { label: 'Usuários', routeLink: 'usuarios', component: UsuariosListagemComponent }
      ]
    },
    {
      label: 'Logs',
      icon: 'pi pi-chart-scatter',
      children: [
        { label: 'Logs dos usuários', routeLink: 'logs', component: LogsUsuariosListagemComponent }
      ]
    }
  ];
}
