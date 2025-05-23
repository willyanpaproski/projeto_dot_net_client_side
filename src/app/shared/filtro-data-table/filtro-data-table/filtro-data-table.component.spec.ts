import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroDataTableComponent } from './filtro-data-table.component';

describe('FiltroDataTableComponent', () => {
  let component: FiltroDataTableComponent;
  let fixture: ComponentFixture<FiltroDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltroDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltroDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
