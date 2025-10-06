import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent {
  auth = inject(AuthService); // gives template access to isAdmin(), currentUser(), etc.
}
