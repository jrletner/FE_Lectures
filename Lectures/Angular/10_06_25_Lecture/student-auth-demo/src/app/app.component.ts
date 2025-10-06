import { Component, signal, computed, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AdminPanelComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'My Auth Demo';
  // --- Local form field signals (not in the service) ---
  usernameInput = signal('');
  passwordInput = signal('');

  // Keep the actual service private (encapsulation / façade)
  private auth = inject(AuthService);

  // Publicly exposed references used by the template
  currentUser = this.auth.currentUser;
  isAuthenticated = this.auth.isAuthenticated;
  isAdmin = this.auth.isAdmin;
  isLoading = this.auth.isLoading;
  errorMessage = this.auth.errorMessage;
  demoAccounts = this.auth.demoAccounts; // plain array of safe demo entries

  // Validation logic for enabling the submit button
  canSubmit = computed(
    () =>
      this.usernameInput().trim() !== '' && this.passwordInput().trim() !== ''
  );

  submit(): void {
    if (!this.canSubmit() || this.isLoading()) return; // prevent invalid/duplicate submits
    this.auth.login(this.usernameInput().trim(), this.passwordInput().trim());
  }

  logout(): void {
    this.auth.logout();
  }
}
