import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../menu/sidebar/sidebar.component";
import { HeaderComponent } from "../menu/header/header.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dato-salud',
  templateUrl: './dato-salud.component.html',
  styleUrls: ['./dato-salud.component.css'],
  imports: [SidebarComponent, HeaderComponent, FormsModule, CommonModule]
})
export class DatoSaludComponent implements OnInit {
  edad!: number;
  peso!: number;
  altura!: number;
  condiciones = { cardiaca: false, diabetica: false, articular: false };
  impedimento: string = '';
  actividad!: string;
  imc: number = 0;

  dias = [
    { nombre: 'Lunes', seleccionado: false },
    { nombre: 'Martes', seleccionado: false },
    { nombre: 'Miércoles', seleccionado: false },
    { nombre: 'Jueves', seleccionado: false },
    { nombre: 'Viernes', seleccionado: false },
    { nombre: 'Sábado', seleccionado: false },
    { nombre: 'Domingo', seleccionado: false },
  ];
  constructor() { }

  ngOnInit() {
  }

  calcularIMC() {
    if (this.peso > 0 && this.altura > 0) {
      this.imc = this.peso / (this.altura * this.altura);
    } else {
      this.imc = 0;
    }
  }
}
