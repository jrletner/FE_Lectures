import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClubService } from '../../shared/services/club.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-club-edit',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: 'club-edit.component.html',
  styleUrls: ['club-edit.component.css'],
})
export class ClubEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(ClubService);
  auth = inject(AuthService);

  id = this.route.snapshot.paramMap.get('id')!;
  club = computed(() => this.svc.clubs().find((c) => c.id === this.id));

  name = signal('');
  capacity = signal(1);
  msg = signal<string | null>(null);

  constructor() {
    const c = this.club();
    if (!c) this.svc.load();
    else {
      this.name.set(c.name);
      this.capacity.set(c.capacity);
    }
  }

  save() {
    const res = this.svc.updateClub(this.id, {
      name: this.name().trim(),
      capacity: this.capacity(),
    });
    if (!res.ok) this.msg.set(res.message || 'Could not save');
    else this.router.navigate(['/clubs', this.id]);
  }

  async onDelete() {
    if (!confirm('Delete this club?')) return;
    const ok = await this.svc.deleteClub(this.id);
    if (ok) this.router.navigateByUrl('/');
    else this.msg.set('Delete failed');
  }
}
