import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from '../../general/interfaces/menu';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../general/servicios/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() role: 'administrador' | 'cliente' | 'entrenador' | null = null;
  @Output() toggle = new EventEmitter<void>();
  isOpen = false;
  constructor(private router: Router, private authservice:AuthService) { }

  ngOnInit() {
  }

  toggleSidebar(id:boolean) {
    if(id){
      this.isOpen = !this.isOpen;
    }else{
      this.logout()
    }
    
  }
  get menuItems(): MenuItem[] {
    switch (this.role) {
      case 'administrador':
        return [
          { label: 'Crear Usuario', icon: 'person_add', route: '/administrador' },
        ];
      case 'cliente':
        return [
          { label: 'Datos Salud', icon: 'favorite', route: '/salud' },
          { label: 'Rutina Diaria', icon: 'fitness_center', route: '/cliente' },  
        ];
      case 'entrenador':
        return [
          { label: 'Crear Rutina', icon: 'fitness_center', route: '/crear/rutina' },
          { label: 'Asignar Rutina', icon: 'assignment', route: '/entrenador' }, 
        ];
      default:
        return [];
    }
  }
  logout() {
      this.authservice.logout();
      this.router.navigate(['/login']);
  }
  onToggle() {
    this.toggleSidebar(true);
    this.toggle.emit();
  }

}
