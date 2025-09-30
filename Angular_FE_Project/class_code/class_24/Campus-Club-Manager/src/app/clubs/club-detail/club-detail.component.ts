import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClubService } from '../../shared/services/club.service';
import { ToastService } from '../../shared/services/toast.service';
import { FriendlyDatePipe } from '../../shared/pipes/friendly-date.pipe';
import { seatsLeft, percentFull } from '../../shared/models/club.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-club-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FriendlyDatePipe],
  templateUrl: 'club-detail.component.html',
  styleUrls: ['club-detail.component.css'],
})
export class ClubDetailComponent {
  private route = inject(ActivatedRoute);
  private svc = inject(ClubService);
  private toast = inject(ToastService);
  auth = inject(AuthService);
  seatsLeft = seatsLeft;
  percentFull = percentFull;

  id = this.route.snapshot.paramMap.get('id')!;
  club = computed(() => this.svc.clubs().find((c) => c.id === this.id));

  memberName = signal('');
  memberMsg = signal<string | null>(null);

  eventTitle = signal('');
  eventDate = signal<string>('');
  eventCapacity = signal<number>(10);
  eventDescription = signal('');
  eventMsg = signal<string | null>(null);
  expandedEventId = signal<string | null>(null);

  addMember() {
    const res = this.svc.addMember(this.id, this.memberName());
    this.memberMsg.set(res.ok ? null : res.message ?? 'Could not add');
    if (!res.ok) this.toast.error(res.message ?? 'Could not add member');
    if (res.ok) this.memberName.set('');
  }

  removeMember(memberId: string) {
    this.svc.removeMember(this.id, memberId);
  }

  addEvent() {
    const res = this.svc.addEvent(this.id, {
      title: this.eventTitle(),
      dateIso: this.eventDate(),
      capacity: this.eventCapacity(),
      description: this.eventDescription(),
    });
    this.eventMsg.set(res.ok ? null : res.message ?? 'Could not add event');
    if (!res.ok) this.toast.error(res.message ?? 'Could not add event');
    if (res.ok) {
      this.eventTitle.set('');
      this.eventDate.set('');
      this.eventCapacity.set(10);
      console.log(this.eventCapacity());

      this.eventDescription.set('');
    }
  }

  removeEvent(eventId: string) {
    this.svc.removeEvent(this.id, eventId);
  }

  toggleEventDesc(id: string) {
    this.expandedEventId.set(this.expandedEventId() === id ? null : id);
  }
}
