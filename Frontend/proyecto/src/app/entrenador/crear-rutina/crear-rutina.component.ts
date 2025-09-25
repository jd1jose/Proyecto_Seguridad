import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ejercicio, ejercicioDiario, Rutina } from '../../general/interfaces/entrenador';
import { EntrenadorService } from '../../general/servicios/entrenador.service'

@Component({
  selector: 'app-crear-rutina',
  templateUrl: './crear-rutina.component.html',
  styleUrls: ['./crear-rutina.component.css'],
  imports: [ FormsModule, CommonModule],

})
export class CrearRutinaComponent implements OnInit {

  nombreRutina: string = '';
  ejercicios!: Ejercicio[]
  ejercicioSeleccionado!: Ejercicio | null;
  series!: number;
  repeticiones!: number;
  rutina: Rutina[] = [];



  // Modal
  mostrarModal: boolean = false;
  nuevoEjercicio: string = '';



  constructor(
    private entrenadorService: EntrenadorService
  ) {
  }

  ngOnInit(): void {
    this.entrenadorService.obtenerEjercicios().subscribe({
      next: (res) => {
        this.ejercicios = res;
      },
      error: (err) => {
        console.error('Error al obtener ejercicios', err);
      }
    });
  }


  agregarAlaRutina() {
    if (this.ejercicioSeleccionado && this.series > 0 && this.repeticiones > 0) {
      let rutina: Rutina = {
        ejercicio: this.ejercicioSeleccionado,
        series: this.series,
        repeticiones: this.repeticiones,
      };
      this.rutina.push(rutina);

      // reset
      this.series = 0;
      this.repeticiones = 0;
      this.ejercicioSeleccionado = null;
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
    let guardar: ejercicioDiario = {
      nombreRutina: this.nombreRutina,
      rutinas: this.rutina
    }
    this.entrenadorService.guardarRutina(guardar).subscribe({
      next: (res) => {
        console.log('Rutina guardada:', res);
        alert('Rutina guardada exitosamente ✅');
        this.nombreRutina = '';
        this.rutina = [];
      },
      error: (err) => console.error('Error al guardar rutina', err)
    });
  }

  // Modal
  abrirModal() { this.mostrarModal = true; }
  cerrarModal() { this.mostrarModal = false; }

  guardarNuevoEjercicio() {
    if (this.nuevoEjercicio.trim() !== '') {
      this.entrenadorService.agregarEjercicio(this.nuevoEjercicio!).subscribe({
        next: (res) => this.ejercicios.push(res),
        error: (err) => console.error('Error al guardar datos', err)
      })
      this.cerrarModal();
    }
  }

  onSelectChange() {
    console.log('ID seleccionado:', this.ejercicioSeleccionado);
  }

}
