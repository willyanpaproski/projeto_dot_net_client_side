import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsAcessosListagemComponent } from './logs-acessos-listagem.component';

describe('LogsAcessosListagemComponent', () => {
  let component: LogsAcessosListagemComponent;
  let fixture: ComponentFixture<LogsAcessosListagemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsAcessosListagemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsAcessosListagemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
