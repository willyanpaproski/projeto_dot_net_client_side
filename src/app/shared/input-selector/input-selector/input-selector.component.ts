import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  Output
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { ModalComponent } from '../../../modal/modal.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-input-selector',
  standalone: true,
  imports: [ModalComponent, CommonModule],
  templateUrl: './input-selector.component.html',
  styleUrl: './input-selector.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputSelectorComponent),
      multi: true
    }
  ]
})
export class InputSelectorComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() exibirCampo: string = 'id';
  @Input() componenteListagem: any;
  @Input() nomeEntidade: string = '';
  @Input() nomeCampoDescricao: string = '';
  @Output() selected = new EventEmitter<any>();

  value: any;
  descricaoEntidade = '';
  showModal = false;
  modalInjector?: Injector;

  private inputSubject = new Subject<string>();

  // Métodos do ControlValueAccessor
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private injector: Injector, private http: HttpClient) {
    this.inputSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((inputValue) => {
      this.buscarDescricaoEntidade(inputValue);
    });
  }

  // Chamado quando o valor é definido externamente (pelo form)
  writeValue(value: any): void {
    this.value = value;
    if (value) {
      this.buscarDescricaoEntidade(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implementar se quiser suporte a desabilitar o campo
  }

  abrirModal(): void {
    this.modalInjector = Injector.create({
      providers: [
        { provide: 'MODO_SELECAO', useValue: true },
        { provide: 'SELECT_HANDLER', useValue: (item: any) => this.onSelecionar(item) }
      ],
      parent: this.injector
    });

    this.showModal = true;
  }

  onSelecionar(item: any): void {
    this.value = item?.[this.exibirCampo];
    this.descricaoEntidade = item?.[this.nomeCampoDescricao] || '';
    this.onChange(this.value); // Atualiza o form control
    this.selected.emit(item);
    this.fecharModal();
  }

  onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value = inputValue;
    this.onChange(inputValue); // Atualiza o form control
    this.selected.emit({ [this.exibirCampo]: inputValue });
    this.inputSubject.next(inputValue);
  }

  buscarDescricaoEntidade(id: string): void {
    if (!id || isNaN(+id)) {
      this.descricaoEntidade = '';
      return;
    }

    this.http.get<any>(`http://localhost:5250/api/${this.nomeEntidade}/${id}`).subscribe({
      next: (data) => {
        this.descricaoEntidade = data?.[this.nomeCampoDescricao] || '';
      },
      error: () => {
        this.descricaoEntidade = 'ID inválido';
      }
    });
  }

  fecharModal(): void {
    this.showModal = false;
    this.modalInjector = undefined;
  }
}
