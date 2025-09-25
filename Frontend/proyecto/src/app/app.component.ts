import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './general/servicios/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto';
  userRole: 'administrador' | 'cliente' | 'entrenador' | null = null;
  isSidebarOpen = false;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.role$.subscribe(role => {
      this.userRole = role as any;
      console.log('Rol actual:', this.userRole);
    });
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    console.log('Sidebar abierto:', this.isSidebarOpen);
  }
}
