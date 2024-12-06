import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common'; // Import NgIf
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet, 
    NavMenuComponent,
    CommonModule,
    NgIf
  ]
})
export class AppComponent {
  title = 'frontend';
  constructor(public authService: AuthService) {}
}
