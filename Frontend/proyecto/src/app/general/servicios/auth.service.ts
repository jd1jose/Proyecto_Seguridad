import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

private role: 'administrador' | 'cliente' | 'entrenador' | null = null;

   private roleSubject = new BehaviorSubject<string | null>(localStorage.getItem('rol'));
  role$ = this.roleSubject.asObservable();

  setRole(role: string) {
    localStorage.setItem('rol', role);
    this.roleSubject.next(role);
  }

  clearRole() {
    localStorage.removeItem('rol');
    this.roleSubject.next(null);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.role = null;
    this.roleSubject.next(null); 
  }
}
