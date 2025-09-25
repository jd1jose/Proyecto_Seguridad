import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GeneralService {

  private baseUrl = 'http://127.0.0.1:5000/api'; // URL del backend Flask

  constructor(private http: HttpClient) { }

  getSaludo(): Observable<any> {
    return this.http.get(`${this.baseUrl}/login`);
  }

}
