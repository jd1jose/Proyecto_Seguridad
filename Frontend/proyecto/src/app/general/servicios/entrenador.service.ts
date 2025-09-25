import { Injectable } from '@angular/core';
import { generalURL } from '../interfaces/general';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ejercicio, RutinaPreescrita } from '../interfaces/entrenador';


@Injectable({
  providedIn: 'root'
})
export class EntrenadorService {

  private apiUrl = generalURL;

  constructor(private http: HttpClient) { }

  /*login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl.url}/login`, { credentials });
  }*/

  agregarEjercicio(nombre: string): Observable<Ejercicio> {
    return this.http.post<Ejercicio>(`${this.apiUrl.url}/ejercicio/crear`, { nombre });
  }

  obtenerEjercicios(): Observable<Ejercicio[]> {
    return this.http.get<Ejercicio[]>(`${this.apiUrl.url}/ejercicios`);
  }

  guardarRutina(rutina: any): Observable<any> {
    return this.http.post(`${this.apiUrl.url}/crear/rutinas`, rutina);
  }

  obtenerRutinas(): Observable<RutinaPreescrita[]> {
    return this.http.get<RutinaPreescrita[]>(`${this.apiUrl.url}/rutinas/preescritas`);
  }

  guardarAsignacion(asignacion: any): Observable<any> {
    return this.http.post(`${this.apiUrl.url}/asignar/rutina`, asignacion);
  }

}
