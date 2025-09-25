import { Routes } from '@angular/router';
import { RutinaDiariaComponent } from './cliente/rutina-diaria/rutina-diaria.component';
import { InicioSesionComponent } from './loggin/inicio-sesion/inicio-sesion.component';
import { AsignarRutinaComponent } from './entrenador/asignar-rutina/asignar-rutina.component';
import { DatoSaludComponent } from './cliente/dato-salud/dato-salud.component';
import { CrearRutinaComponent } from './entrenador/crear-rutina/crear-rutina.component';
import { CrearUsuarioComponent } from './administrador/crear-usuario/crear-usuario.component';
import { AuthGuard } from './general/guards/auth-guard.service';

export const routes: Routes = [
    { path: 'login', component: InicioSesionComponent },

    //administrador
    { path: 'administrador', component: CrearUsuarioComponent, canActivate: [AuthGuard] },
    
    //cliente
    { path: 'cliente', component: RutinaDiariaComponent,canActivate: [AuthGuard] },
    //{ path: 'rutina', component: RutinaDiariaComponent },
    { path: 'salud', component: DatoSaludComponent,canActivate: [AuthGuard] },

    //entrenador
    { path: 'entrenador', component: AsignarRutinaComponent,canActivate: [AuthGuard] },
    { path: 'crear/rutina', component: CrearRutinaComponent,canActivate: [AuthGuard] },
    //{ path: 'asignar/rutina', component: AsignarRutinaComponent },
    
    //cerar sesion
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
