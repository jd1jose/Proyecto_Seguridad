import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../general/interfaces/inicio-sesion';
import { InicioSesionService } from '../../general/servicios/inicio-sesion.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../general/servicios/auth.service';
@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class InicioSesionComponent implements OnInit {

  login!: LoginRequest

  constructor(
    private inicioSesionService: InicioSesionService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  email: string = '';
  password: string = '';
  error!: string
  onSubmit() {

    let login: LoginRequest = {
      email: this.email,
      password: this.password
    }
    this.inicioSesionService.login(login).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);   // ✅ guardamos el token
        console.log("Redirigiendo...")
        let role: string;
        switch (res.rol) {
          case 1:
            role = 'administrador';
            break;
          case 2:
            role = 'cliente';
            break;
          case 3:
            role = 'entrenador';
            break;
          default:
            role = '';
        }
        // Guardar en localStorage
        localStorage.setItem('rol', role);

        // Actualizar servicio
        this.authService.setRole(role);
        if (res.rol === 1) {
          this.router.navigate(['/administrador']);
        } else if (res.rol === 2) {
          this.router.navigate(['/cliente']);
        } else if (res.rol === 3) {
          this.router.navigate(['/entrenador']);
        } else {
          this.router.navigate(['/login']); // fallback
        }
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Usuario o contraseña incorrectos';
        this.snackBar.open('❌ Usuario o contraseña incorrectos', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

}
