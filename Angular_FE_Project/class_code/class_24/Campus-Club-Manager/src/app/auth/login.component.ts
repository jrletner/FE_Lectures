import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  username = '';
  pin = '';
  busy = signal(false);

  async onSubmit() {
    if (!/^\d{4}$/.test(this.pin)) {
      this.toast.error('PIN must be exactly 4 digits');
      return;
    }
    this.busy.set(true);
    const res = await this.auth.login(this.username, this.pin);
    this.busy.set(false);
    if (!res.ok) this.toast.error(res.message ?? 'Login failed');
    else {
      this.toast.success(`Welcome, ${this.username}!`);
      this.router.navigateByUrl('/');
    }
  }
}
