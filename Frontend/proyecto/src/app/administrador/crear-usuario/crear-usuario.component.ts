import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../general/interfaces/administrador';
import { AdministradorService } from '../../general/servicios/administrador.service'
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../menu/sidebar/sidebar.component';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class CrearUsuarioComponent implements OnInit {

  usuario: Usuario = {
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    genero: '',
    email: '',
    telefono: '',
    rol: '',
    password: ''
  };

  constructor(
    private administradorService: AdministradorService
  ) { }

  ngOnInit() {


  }

  esMayorDeEdad(fechaNacimiento: string): boolean {
    if (!fechaNacimiento) return true; // si no hay fecha todavía
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    const dia = hoy.getDate() - fechaNac.getDate();

    // Ajuste por mes y día
    if (mes < 0 || (mes === 0 && dia < 0)) {
      return edad - 1 >= 18;
    }
    return edad >= 18;
  }

  onSubmit() {
    if (!this.esMayorDeEdad(String(this.usuario.fechaNacimiento))) {
      alert('❌ Debes ser mayor de 18 años');
      return;
    }

    if (new Date(this.usuario.fechaNacimiento) > new Date()) {
      alert('❌ La fecha de nacimiento no puede ser posterior a hoy');
      return;
    }
    this.administradorService.registrarUsuario(this.usuario).subscribe({
      next: (res) => {
        //console.log('Usuario registrado:', res);
        alert('Registro exitoso');
        this.usuario = {
          nombre: '',
          apellido: '',
          fechaNacimiento: '',
          genero: '',
          email: '',
          telefono: '',
          rol: '',
          password: ''
        };
      },
      error: (err) => {
        //console.error('Error en el registro:', err);
        alert(err.error.error);
      }
    });
  }

}
