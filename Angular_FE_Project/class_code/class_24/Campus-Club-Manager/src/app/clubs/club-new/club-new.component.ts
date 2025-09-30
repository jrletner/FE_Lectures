import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClubService } from '../../shared/services/club.service';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-club-new',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './club-new.component.html',
  styleUrl: './club-new.component.css',
})
export class ClubNewComponent {
  private svc = inject(ClubService);
  private router = inject(Router);
  private toast = inject(ToastService);
  auth = inject(AuthService);

  name = signal('');
  capacity = signal(10);
  message = signal<string | null>(null);

  isValid = computed(
    () => this.name().trim().length > 0 && this.capacity() >= 1
  );

  submit() {
    const result = this.svc.createClub({
      name: this.name(),
      capacity: this.capacity(),
    });
    if (!result.ok) {
      const msg = result.message ?? 'Could not create club';
      this.message.set(msg);
      this.toast.error(msg);
      return;
    }
    this.router.navigateByUrl('/');
  }
}
