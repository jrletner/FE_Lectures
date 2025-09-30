import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../shared/services/club.service';
import { seatsLeft, percentFull } from '../../shared/models/club.model';
import { QuickEventComponent } from '../../shared/ui/quick-event/quick-event.component';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [CommonModule, RouterLink, QuickEventComponent],
  templateUrl: './club-list.component.html',
  styleUrl: './club-list.component.css',
})
export class ClubListComponent implements OnInit {
  svc = inject(ClubService);
  toast = inject(ToastService);
  auth = inject(AuthService);

  // debounce search
  private searchTimer: any;
  search = signal('');
  // Track which clubs the current user has "held" a spot for during this session
  private heldSpots = new Set<string>();

  constructor() {
    effect(() => {
      const q = this.search();
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => this.svc.searchText.set(q), 300);
    });
  }

  ngOnInit(): void {
    if (this.svc.clubs().length === 0) {
      this.svc.load();
    }
  }

  onToggleOnlyOpen(checked: boolean) {
    this.svc.onlyOpen.set(checked);
  }

  onSortChange(sort: string) {
    this.svc.sortBy.set(sort as any);
  }

  seatsLeft = seatsLeft;
  percentFull = percentFull;

  addQuickEvent(
    clubId: string,
    payload: {
      title: string;
      dateIso: string;
      capacity: number;
      description: string;
    }
  ) {
    const res = this.svc.addEvent(clubId, payload);
    if (!res.ok) this.toast.error(res.message ?? 'Could not add event');
  }

  // Spot reservation UX: only show "Give up spot" after a successful hold
  hasHeld(id: string): boolean {
    const user = this.auth.user();
    if (!user) return false;
    const club = this.svc.clubs().find((c) => c.id === id);
    if (club && club.members.some((m) => m.id === user.id)) return true;
    return this.heldSpots.has(id);
  }
  onHoldSpot(clubId: string) {
    const res = this.svc.holdSpot(clubId);
    if (res.ok) this.heldSpots.add(clubId);
  }
  onGiveUpSpot(clubId: string) {
    const club = this.svc.clubs().find((c) => c.id === clubId);
    if (!club || club.members.length === 0) return;
    this.svc.giveUpSpot(clubId);
    this.heldSpots.delete(clubId);
  }

  // Delete club with confirmation; removes club and its child records (members/events) server-side.
  async onDeleteClick(e: Event, clubId: string) {
    e.preventDefault();
    e.stopPropagation();
    const confirmed = confirm(
      'Delete this club and all of its members and events? This cannot be undone.'
    );
    if (!confirmed) return;
    const ok = await this.svc.deleteClub(clubId);
    if (!ok) return;
    // Close menu if it was open for this club
    this.onMenuClose(clubId);
  }

  // Title menu delayed open/close state
  private readonly HOVER_DELAY_MS = 1000; // begin transition after 1.0s hover
  private readonly OPEN_ANIM_MS = 1500; // keep in sync with CSS transition
  private menuDelayTimers = new Map<string, any>();
  private menuOpenTimers = new Map<string, any>();
  // possible states: 'closed' | 'opening' | 'open'
  private menuState = new Map<string, 'closed' | 'opening' | 'open'>();

  getMenuState(id: string): 'closed' | 'opening' | 'open' {
    return this.menuState.get(id) ?? 'closed';
  }

  onTitleEnter(id: string) {
    if (this.getMenuState(id) === 'open') return;
    // ensure closed state and clear any timers
    this.clearAllMenuTimers(id);
    this.menuState.set(id, 'closed');
    // after delay, begin opening animation
    const delayT = setTimeout(() => {
      this.menuState.set(id, 'opening');
      // after animation duration, mark as fully open
      const openT = setTimeout(() => {
        this.menuState.set(id, 'open');
        this.menuOpenTimers.delete(id);
      }, this.OPEN_ANIM_MS);
      this.menuOpenTimers.set(id, openT);
      this.menuDelayTimers.delete(id);
    }, this.HOVER_DELAY_MS);
    this.menuDelayTimers.set(id, delayT);
  }

  onTitleLeave(id: string) {
    const state = this.getMenuState(id);
    if (state === 'open') {
      // once fully open, hovering off shouldn't close it; only X closes
      return;
    }
    // cancel pending open and close immediately
    this.clearAllMenuTimers(id);
    this.menuState.set(id, 'closed');
  }

  onMenuClose(id: string) {
    this.clearAllMenuTimers(id);
    this.menuState.set(id, 'closed');
  }

  private clearAllMenuTimers(id: string) {
    const d = this.menuDelayTimers.get(id);
    if (d) {
      clearTimeout(d);
      this.menuDelayTimers.delete(id);
    }
    const o = this.menuOpenTimers.get(id);
    if (o) {
      clearTimeout(o);
      this.menuOpenTimers.delete(id);
    }
  }
}
