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
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { ModalComponent } from '../../../modal/modal.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-input-selector',
  standalone: true,
  imports: [ModalComponent, CommonModule, FormsModule],
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

  value: any = '';
  descricaoEntidade = '';
  showModal = false;
  modalInjector?: Injector;

  private inputSubject = new Subject<string>();

  // Métodos do ControlValueAccessor
  private onChange: (value: any) => void = () => {};
  public onTouched: () => void = () => {};

  constructor(private injector: Injector, private http: HttpClient) {
    this.inputSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((inputValue) => {
      this.buscarDescricaoEntidade(inputValue);
    });
  }

  writeValue(value: any): void {
    this.value = value ?? '';
    if (value) {
      this.buscarDescricaoEntidade(value);
    } else {
      this.descricaoEntidade = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
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
    this.onChange(this.value);
    this.selected.emit(item);
    this.fecharModal();
  }

  onInputChange(novoValor: any): void {
    this.value = novoValor;
    this.onChange(novoValor);
    this.selected.emit({ [this.exibirCampo]: novoValor });
    this.inputSubject.next(novoValor);
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
