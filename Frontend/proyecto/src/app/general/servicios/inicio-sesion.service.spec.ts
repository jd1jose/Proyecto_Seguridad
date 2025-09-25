/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InicioSesionService } from './inicio-sesion.service';

describe('Service: InicioSesion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InicioSesionService]
    });
  });

  it('should ...', inject([InicioSesionService], (service: InicioSesionService) => {
    expect(service).toBeTruthy();
  }));
});
