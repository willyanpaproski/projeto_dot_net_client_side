import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsAcessosVisualizacaoComponent } from './logs-acessos-visualizacao.component';

describe('LogsAcessosVisualizacaoComponent', () => {
  let component: LogsAcessosVisualizacaoComponent;
  let fixture: ComponentFixture<LogsAcessosVisualizacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsAcessosVisualizacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsAcessosVisualizacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
