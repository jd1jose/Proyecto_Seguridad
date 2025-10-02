import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../general/interfaces/inicio-sesion';
import { InicioSesionService } from '../../general/servicios/inicio-sesion.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../general/servicios/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class InicioSesionComponent implements OnInit {

  login!: LoginRequest
  email: string = '';
  password: string = '';
  error!: string
  paso: number = 1; // 1 = login, 2 = OTP
  codigo: string = '';

  constructor(
    private inicioSesionService: InicioSesionService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) { 
  }

  ngOnInit() {
  }

  onSubmit() {
    const login: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.inicioSesionService.login(login).subscribe({
      next: (res: any) => {
        this.snackBar.open('📧 Se envió un código a tu correo', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.paso = 2; // mostrar pantalla OTP
      },
      error: (err: any) => {
        console.error(err);
        this.error = err.error?.message || 'Usuario o contraseña incorrectos';
        this.snackBar.open(`❌ ${this.error}`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  // Paso 2: Verificar OTP y guardar token
  onVerificarOtp() {
    this.inicioSesionService.verificarOtp(this.email, this.codigo).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);

        let role: string;
        switch (res.rol) {
          case 1:
            role = 'administrador'; break;
          case 2:
            role = 'cliente'; break;
          case 3:
            role = 'entrenador'; break;
          default:
            role = '';
        }

        localStorage.setItem('rol', role);
        this.authService.setRole(role);

        this.snackBar.open('✅ Autenticación completada', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });

        // Redirigir según rol
        if (res.rol === 1) {
          this.router.navigate(['/administrador']);
        } else if (res.rol === 2) {
          this.router.navigate(['/cliente']);
        } else if (res.rol === 3) {
          this.router.navigate(['/entrenador']);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err: any) => {
        console.error(err);
        this.snackBar.open(`❌ ${err.error?.message || 'Error al verificar OTP'}`, 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

}
