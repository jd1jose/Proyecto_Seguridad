import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';
import { ClienteService } from '../../general/servicios/cliente.service'
import { Ejercicio } from '../../general/interfaces/entrenador';
import { EntrenadorService } from '../../general/servicios/entrenador.service';


@Component({
  selector: 'app-rutina-diaria',
  templateUrl: './rutina-diaria.component.html',
  styleUrls: ['./rutina-diaria.component.css'],
  imports: [FormsModule, CommonModule]
})
export class RutinaDiariaComponent implements OnInit {

  constructor(
    private clienteService: ClienteService,
    private entrenadorService: EntrenadorService
  ) { }

  hoy = new Date();
  ejercicios!: Ejercicio[];
  todosCompletados = false;
  finalizado = false;
  idRutina!: number

  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    this.clienteService.obtenerEjerciciosAsignados().subscribe({
      next: (result) => {
        // añadimos campo completado = false para controlarlo en Angular
        this.ejercicios = result.map(e => ({ ...e, completado: false }));
      },
      error: (err) => {
        console.error('Error al cargar ejercicios asignados', err);
        this.ejercicios = []; // fallback
      }
    });
  }

  verificarTodosCompletados() {
    this.todosCompletados = this.ejercicios.every(e => e.completado);
  }

  finalizarDia() {
    // Confeti 🎉
    const myConfetti = confetti.create(this.confettiCanvas.nativeElement, {
      resize: true,
      useWorker: true
    });

    myConfetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    this.finalizado = true

    this.clienteService.finalizarRutinaDiaria(this.idRutina).toPromise()

    // Aquí podrías guardar en backend que se finalizó el día
  }
}
