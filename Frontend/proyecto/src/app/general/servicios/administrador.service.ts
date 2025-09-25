import { Injectable } from '@angular/core';
import { generalURL } from '../interfaces/general';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../interfaces/administrador';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
private apiUrl = generalURL;
constructor(private http: HttpClient) { }

registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.apiUrl.url}/registar`, usuario);
  }

}
