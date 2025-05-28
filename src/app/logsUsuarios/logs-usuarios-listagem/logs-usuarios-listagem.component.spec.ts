import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsUsuariosListagemComponent } from './logs-usuarios-listagem.component';

describe('LogsUsuariosListagemComponent', () => {
  let component: LogsUsuariosListagemComponent;
  let fixture: ComponentFixture<LogsUsuariosListagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsUsuariosListagemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsUsuariosListagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
