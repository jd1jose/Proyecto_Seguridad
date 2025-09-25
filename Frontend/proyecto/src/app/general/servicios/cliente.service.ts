import { Injectable } from '@angular/core';
import { generalURL } from '../interfaces/general';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { clienteData, DatosSalud } from '../interfaces/cliente';
import { Ejercicio } from '../interfaces/entrenador';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = generalURL;

  constructor(private http: HttpClient) { }


  guardarDatos(datos: DatosSalud): Observable<any> {
    return this.http.post<any>(`${this.apiUrl.url}/health/data`, datos);
  }

  obtenerUltimoDato(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl.url}/health/last`);
  }

  obtenerClientes(): Observable<clienteData[]> {
    return this.http.get<clienteData[]>(`${this.apiUrl.url}/usuarios/clientes`);
  }

  obtenerEjerciciosAsignados(): Observable<Ejercicio[]> {
    return this.http.get<Ejercicio[]>(`${this.apiUrl.url}/usuario/ejercicios`);
  }

  finalizarRutinaDiaria(idRutina: number): Observable<any> {
    return this.http.post(`${this.apiUrl.url}/rutina/finalizar`, { idRutina });
  }

}
