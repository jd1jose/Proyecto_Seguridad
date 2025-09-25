import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../general/servicios/cliente.service';
import { DatosSalud } from '../../general/interfaces/cliente';

@Component({
  selector: 'app-dato-salud',
  templateUrl: './dato-salud.component.html',
  styleUrls: ['./dato-salud.component.css'],
  imports: [ FormsModule, CommonModule]
})
export class DatoSaludComponent implements OnInit {
  edad!: number;
  peso!: number;
  altura!: number;
  condiciones = { cardiaca: false, diabetica: false, articular: false };
  impedimento: string = '';
  actividad!: string;
  imc: number = 0;
  //ultimoDato: any = null;

  dias = [
    { nombre: 'Lunes', seleccionado: false },
    { nombre: 'Martes', seleccionado: false },
    { nombre: 'Miércoles', seleccionado: false },
    { nombre: 'Jueves', seleccionado: false },
    { nombre: 'Viernes', seleccionado: false },
    { nombre: 'Sábado', seleccionado: false },
    { nombre: 'Domingo', seleccionado: false },
  ];
  constructor(
    private clienteService: ClienteService
  ) { }

  ngOnInit() {
    this.clienteService.obtenerUltimoDato().subscribe({
      next: (res) => {
        console.log("Último dato:", res);
        //this.ultimoDato = res;
        if (res) {
          this.peso = res.peso;
          this.altura = res.altura;
          this.actividad = res.actividad_fisica;
          this.imc = res.imc;

          // Si la condición viene como texto plano
          if (res.condicion) {
            this.condiciones = {
              cardiaca: res.condicion.includes("Cardiaca"),
              diabetica: res.condicion.includes("Diabética"),
              articular: res.condicion.includes("Articular")
            };
          }
        }
      },
      error: (err) => console.error("Error al obtener último dato", err)
    });
  }

  calcularIMC() {
    if (this.peso > 0 && this.altura > 0) {
      this.imc = this.peso / (this.altura * this.altura);
    } else {
      this.imc = 0;
    }
  }

  guardar() {
    const datos: DatosSalud = {
      edad: this.edad,
      peso: this.peso,
      altura: this.altura,
      condiciones: this.condiciones,
      impedimento: this.impedimento,
      actividad: this.actividad,
      imc: this.imc,
      dias: this.dias
    };

    this.clienteService.guardarDatos(datos).subscribe({
      next: (res) => {
        alert('Datos guardados exitosamente');
      },
      error: (err) => console.error('Error al guardar datos', err)
    });
  }
}
