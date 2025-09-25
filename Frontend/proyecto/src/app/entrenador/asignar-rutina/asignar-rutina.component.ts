import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../general/servicios/cliente.service';
import { clienteData } from '../../general/interfaces/cliente';
import { asignacion, RutinaPreescrita } from '../../general/interfaces/entrenador';
import { EntrenadorService } from '../../general/servicios/entrenador.service';

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
  imports: [FormsModule, CommonModule],
})
export class AsignarRutinaComponent implements OnInit {

  clientes: clienteData[] = [];
  rutinas: RutinaPreescrita[] = [];

  clienteSeleccionadoId: number | null = null;
  rutinaSeleccionadaId: number | null = null;

  asignaciones: { [clienteId: number]: number[] } = {};

  constructor(
    private entrenadorService: EntrenadorService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {

    this.clienteService.obtenerClientes().subscribe({
      next: (res) => {
        this.clientes = res;
        res.forEach(c => this.asignaciones[c.id] = []);
      },
      error: (err) => console.error('Error al cargar clientes', err)
    });

    this.entrenadorService.obtenerRutinas().subscribe({
      next: (res) => this.rutinas = res,
      error: (err) => console.error('Error al cargar rutinas', err)
    });
  }


  guardarAsignacion() {
    if (!this.clienteSeleccionadoId || !this.rutinaSeleccionadaId) {
      alert('Seleccione un cliente y una rutina');
      return;
    }

    let asig: asignacion = {
      idUsuario: this.clienteSeleccionadoId,
      idPreescrita: this.rutinaSeleccionadaId
    };

    this.entrenadorService.guardarAsignacion(asig).subscribe({
      next: (res) => {
        alert("✅ Asignación guardada:");
      },
      error: (err) => {
        console.error("❌ Error al asignar rutina:", err);
      }
    });

    this.rutinaSeleccionadaId = null;
    this.clienteSeleccionadoId = null
  }

  eliminarAsignacion(clienteId: number, index: number) {
    this.asignaciones[clienteId].splice(index, 1);
  }
}
