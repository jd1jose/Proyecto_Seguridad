import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../menu/sidebar/sidebar.component";
import { HeaderComponent } from "../menu/header/header.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface EjercicioRutina {
  nombre: string;
  series: number;
  repeticiones: number;
}

interface Rutina {
  nombre: string;
  ejercicios: EjercicioRutina[];
}

@Component({
  selector: 'app-asignar-rutina',
  templateUrl: './asignar-rutina.component.html',
  styleUrls: ['./asignar-rutina.component.css'],
  imports: [SidebarComponent, HeaderComponent, FormsModule, CommonModule],
})
export class AsignarRutinaComponent implements OnInit {

rutinas: Rutina[] = [
    { nombre: 'Rutina A', ejercicios: [{ nombre: 'Sentadillas', series: 3, repeticiones: 12 }, { nombre: 'Flexiones', series: 3, repeticiones: 10 }] },
    { nombre: 'Rutina B', ejercicios: [{ nombre: 'Plancha', series: 3, repeticiones: 60 }, { nombre: 'Burpees', series: 3, repeticiones: 15 }] },
    { nombre: 'Rutina C', ejercicios: [{ nombre: 'Curl Bíceps', series: 3, repeticiones: 12 }] }
  ];

  clientes: string[] = ['Luis Fernando', 'Maria Luisa', 'Jose David'];

  clienteSeleccionado: string = '';
  rutinaSeleccionada: string = '';

  asignaciones: { [cliente: string]: string[] } = {};

  constructor() { }

  ngOnInit(): void {
    this.clientes.forEach(c => this.asignaciones[c] = []);
  }

  guardarAsignacion() {
    if (!this.clienteSeleccionado || !this.rutinaSeleccionada) {
      alert('Seleccione un cliente y una rutina');
      return;
    }

    if (!this.asignaciones[this.clienteSeleccionado].includes(this.rutinaSeleccionada)) {
      this.asignaciones[this.clienteSeleccionado].push(this.rutinaSeleccionada);
    } else {
      alert('La rutina ya está asignada a este cliente');
    }

    // Limpiar selección
    this.rutinaSeleccionada = '';
  }

  eliminarAsignacion(cliente: string, index: number) {
    this.asignaciones[cliente].splice(index, 1);
  }

  obtenerEjercicios(rutinaNombre: string) {
    const rutina = this.rutinas.find(r => r.nombre === rutinaNombre);
    return rutina ? rutina.ejercicios : [];
  }
}
