import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { ToastService } from '../shared/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from '../shared/tokens/api-base.token';

@Component({
  selector: 'app-change-pin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'change-pin.component.html',
  styleUrls: ['change-pin.component.css'],
})
export class ChangePinComponent {
  @Output() close = new EventEmitter<void>();
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private apiBase = (inject(API_BASE, { optional: true }) ?? '/api').replace(
    /\/+$/,
    ''
  );
  pin = '';
  confirm = '';
  message = '';
  busy = signal(false);

  async submit() {
    this.message = '';
    if (!/^\d{4}$/.test(this.pin)) {
      this.message = 'PIN must be exactly 4 digits';
      return;
    }
    if (this.pin !== this.confirm) {
      this.message = 'PINs do not match';
      return;
    }
    const user = this.auth.user();
    if (!user) {
      this.message = 'You must be signed in';
      return;
    }
    this.busy.set(true);
    try {
      await this.http
        .patch(`${this.apiBase}/users/${user.id}`, { pin: this.pin })
        .toPromise();
      this.message = 'PIN updated';
      this.toast.success('PIN updated');
      setTimeout(() => this.close.emit(), 400);
    } catch (e: any) {
      this.message = e?.error?.error || 'Failed to update PIN';
      this.toast.error(this.message);
    } finally {
      this.busy.set(false);
    }
  }
}
