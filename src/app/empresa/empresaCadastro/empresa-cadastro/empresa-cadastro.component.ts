import { Component, inject, InjectionToken } from '@angular/core';

export const EMPRESA_DATA = new InjectionToken<any>('EMPRESA_DATA');

@Component({
  selector: 'app-empresa-cadastro',
  imports: [],
  templateUrl: './empresa-cadastro.component.html',
  styleUrl: './empresa-cadastro.component.css'
})
export class EmpresaCadastroComponent {
  empresa = inject(EMPRESA_DATA, { optional: true });

  constructor() {
    console.log('Empresa recebida no modal: ', this.empresa);
  }
}
