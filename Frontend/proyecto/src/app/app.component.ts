import { Component } from '@angular/core';
import { InicioSesionComponent } from "./loggin/inicio-sesion/inicio-sesion.component";
import { CrearUsuarioComponent } from './loggin/crear-usuario/crear-usuario.component';
import { RutinaDiariaComponent } from './cliente/rutina-diaria/rutina-diaria.component';
import { DatoSaludComponent } from './cliente/dato-salud/dato-salud.component'
import { CrearRutinaComponent } from "./entrenador/crear-rutina/crear-rutina.component";
import { AsignarRutinaComponent } from "./entrenador/asignar-rutina/asignar-rutina.component";
//import { AppRoutingModule } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [
    InicioSesionComponent,
    CrearUsuarioComponent,
    RutinaDiariaComponent,
    DatoSaludComponent,
    CrearRutinaComponent,
    AsignarRutinaComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto';
}
