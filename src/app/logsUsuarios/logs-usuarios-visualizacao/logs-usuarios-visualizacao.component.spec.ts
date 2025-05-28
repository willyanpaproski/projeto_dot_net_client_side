import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsUsuariosVisualizacaoComponent } from './logs-usuarios-visualizacao.component';

describe('LogsUsuariosVisualizacaoComponent', () => {
  let component: LogsUsuariosVisualizacaoComponent;
  let fixture: ComponentFixture<LogsUsuariosVisualizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsUsuariosVisualizacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsUsuariosVisualizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
