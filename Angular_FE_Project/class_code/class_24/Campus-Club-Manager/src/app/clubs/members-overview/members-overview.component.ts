import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClubService } from '../../shared/services/club.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-members-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './members-overview.component.html',
  styleUrls: ['./members-overview.component.css'],
})
export class MembersOverviewComponent implements OnInit {
  svc = inject(ClubService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  auth = inject(AuthService);
  focusedId = signal<string | null>(null);

  selectedClub = computed(() => {
    const list = this.svc.clubs();
    const id = this.focusedId();
    if (id) return list.find((c) => c.id === id) ?? null;
    return list.length > 0 ? list[0] : null;
  });

  canHoldSelected = computed(() => {
    const user = this.auth.user();
    const club = this.selectedClub();
    if (!user || !club) return false;
    if (club.members.length >= club.capacity) return false;
    return !club.members.some((mm) => mm.id === user.id);
  });

  // Keep focused selection valid as clubs load or change
  private ensureValidSelection = effect(() => {
    const list = this.svc.clubs();
    if (list.length === 0) return;
    const current = this.focusedId();
    const exists = current ? list.some((c) => c.id === current) : false;
    if (!current || !exists) this.focusedId.set(list[0].id);
  });

  ngOnInit(): void {
    if (this.svc.clubs().length === 0) {
      this.svc.load();
    }

    // Initialize selection from initial URL snapshot
    const initialId = this.route.snapshot.queryParamMap.get('clubId');
    if (initialId) {
      this.focusedId.set(initialId);
      // If the club isn’t present yet, fetch it immediately
      const exists = this.svc.clubs().some((c) => c.id === initialId);
      if (!exists) {
        this.svc.fetchClub(initialId);
      }
      if (this.svc.clubs().length === 0 && !this.svc.loading()) {
        this.svc.load();
      }
    }

    // Read focused club from query param changes
    this.route.queryParamMap.subscribe((m) => {
      const qpId = m.get('clubId');
      if (qpId) {
        this.focusedId.set(qpId);
        // If clubs aren’t loaded yet, attempt to load now so the view can render
        if (this.svc.clubs().length === 0 && !this.svc.loading()) {
          this.svc.load();
        }
        // If the specific club isn’t present yet, fetch it directly
        const exists = this.svc.clubs().some((c) => c.id === qpId);
        if (!exists) {
          this.svc.fetchClub(qpId);
        }
      }
    });

    // Selection validity handled by ensureValidSelection effect
  }

  selectClub(id: string) {
    this.focusedId.set(id);
    // Reflect selection in the URL for deep-linking
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { clubId: id },
      queryParamsHandling: 'merge',
      replaceUrl: false,
    });
  }

  giveUp(clubId: string) {
    this.svc.giveUpSpot(clubId);
  }

  hold(clubId: string) {
    this.svc.holdSpot(clubId);
  }

  remove(clubId: string, memberId: string) {
    if (!this.auth.isAdmin()) return;
    this.svc.removeMember(clubId, memberId);
  }
}
