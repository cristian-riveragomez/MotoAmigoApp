import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstablecimientosPage } from './establecimientos.page';

describe('EstablecimientosPage', () => {
  let component: EstablecimientosPage;
  let fixture: ComponentFixture<EstablecimientosPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EstablecimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
