import { Component, inject, InjectionToken } from '@angular/core';

export const FILIAL_DATA = new InjectionToken<any>('FILIAL_DATA');

@Component({
  selector: 'app-filial-cadastro',
  imports: [],
  templateUrl: './filial-cadastro.component.html',
  styleUrl: './filial-cadastro.component.css'
})
export class FilialCadastroComponent {
  filial = inject(FILIAL_DATA, { optional: true });

  constructor() {
    console.log('Filial recebida no modal: ', this.filial);
  }
}
