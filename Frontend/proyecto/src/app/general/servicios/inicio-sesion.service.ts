import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../interfaces/inicio-sesion';
import { Observable } from 'rxjs';
import { generalURL } from '../interfaces/general';

@Injectable({
  providedIn: 'root'
})
export class InicioSesionService {

  private apiUrl = generalURL;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl.url}/login`, { credentials });
  }

  verificarOtp(email: string, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl.url}/verificar-otp`, { email, codigo });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
