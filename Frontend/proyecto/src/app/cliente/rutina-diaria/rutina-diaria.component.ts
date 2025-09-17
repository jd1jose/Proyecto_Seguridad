import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from "../menu/sidebar/sidebar.component";
import { HeaderComponent } from "../menu/header/header.component";
// import confetti from 'canvas-confetti'; // elimina esto
//const confetti = require('canvas-confetti');
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-rutina-diaria',
  templateUrl: './rutina-diaria.component.html',
  styleUrls: ['./rutina-diaria.component.css'],
  imports: [SidebarComponent, HeaderComponent, FormsModule, CommonModule]
})
export class RutinaDiariaComponent implements OnInit {

  constructor() { }

  hoy = new Date();
  ejercicios: any[] = [];
  todosCompletados = false;

  @ViewChild('confettiCanvas') confettiCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    // Puedes cargar esto dinámicamente desde un servicio
    this.ejercicios = [
      { nombre: 'Calentamiento 10 min', completado: false },
      { nombre: 'Sentadillas 3x15', completado: false },
      { nombre: 'Flexiones 3x12', completado: false },
      { nombre: 'Plancha 1 min', completado: false },
    ];
  }

  verificarTodosCompletados() {
    this.todosCompletados = this.ejercicios.every(e => e.completado);
  }

  finalizarDia() {
    // Confeti 🎉
    /*const myConfetti = confetti.create(this.confettiCanvas.nativeElement, {
      resize: true,
      useWorker: true
    });

    myConfetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });*/

    // Aquí podrías guardar en backend que se finalizó el día
  }
}
