import { Component, inject, InjectionToken, Optional } from '@angular/core';

export const CLIENTE_DATA = new InjectionToken<any>('CLIENTE_DATA');

@Component({
  selector: 'app-cliente-cadastro',
  imports: [],
  templateUrl: './cliente-cadastro.component.html',
  styleUrl: './cliente-cadastro.component.css'
})
export class ClienteCadastroComponent {
  cliente = inject(CLIENTE_DATA, { optional: true });

  constructor() {
    console.log('Cliente recebido no modal: ', this.cliente);
  }
}
