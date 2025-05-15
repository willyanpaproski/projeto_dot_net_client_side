import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilialCadastroComponent } from './filial-cadastro.component';

describe('FilialCadastroComponent', () => {
  let component: FilialCadastroComponent;
  let fixture: ComponentFixture<FilialCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilialCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilialCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
