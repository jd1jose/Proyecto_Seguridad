import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../menu/sidebar/sidebar.component";
import { HeaderComponent } from "../menu/header/header.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-rutina',
  templateUrl: './crear-rutina.component.html',
  styleUrls: ['./crear-rutina.component.css'],
  imports: [SidebarComponent, HeaderComponent, FormsModule, CommonModule],
  
})
export class CrearRutinaComponent implements OnInit {

  nombreRutina: string = '';
  ejercicios: string[] = ['Sentadillas', 'Flexiones', 'Plancha', 'Burpees'];
  ejercicioSeleccionado!: string;
  series!: number;
  repeticiones!: number;
  rutina: any[] = [];

  // Modal
  mostrarModal: boolean = false;
  nuevoEjercicio: string = '';

  constructor() { }

  ngOnInit(): void { }

  agregarAlaRutina() {
    if (this.ejercicioSeleccionado && this.series > 0 && this.repeticiones > 0) {
      this.rutina.push({
        nombre: this.ejercicioSeleccionado,
        series: this.series,
        repeticiones: this.repeticiones
      });
      // reset campos
      this.series = 0;
      this.repeticiones = 0;
      this.ejercicioSeleccionado = '';
    }
  }

  eliminarEjercicio(index: number) {
    this.rutina.splice(index, 1);
  }

  guardarRutina() {
    if (this.nombreRutina.trim() === '' || this.rutina.length === 0) {
      alert('Debe ingresar un nombre de rutina y al menos un ejercicio');
      return;
    }
    console.log('Rutina guardada:', this.nombreRutina, this.rutina);
    alert('Rutina guardada exitosamente ✅');
    // Aquí se puede enviar al backend
    this.nombreRutina = '';
    this.rutina = [];
  }

  // Modal
  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { this.mostrarModal = false; this.nuevoEjercicio = ''; }

  guardarNuevoEjercicio() {
    if (this.nuevoEjercicio.trim() !== '') {
      this.ejercicios.push(this.nuevoEjercicio.trim());
      this.ejercicioSeleccionado = this.nuevoEjercicio.trim();
      this.cerrarModal();
    }
  }

}
