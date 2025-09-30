import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quick-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-event.component.html',
  styleUrls: ['./quick-event.component.css'],
})
export class QuickEventComponent {
  @Output() add = new EventEmitter<{
    title: string;
    dateIso: string;
    capacity: number;
    description: string;
  }>();

  title = signal('');
  date = signal('');
  capacity = signal(10);
  desc = signal('');
  isValid = computed(
    () =>
      this.title().trim().length > 0 &&
      this.date().trim().length > 0 &&
      this.capacity() >= 1
  );

  emitAdd() {
    if (!this.isValid()) return;
    this.add.emit({
      title: this.title(),
      dateIso: this.date(),
      capacity: this.capacity(),
      description: this.desc(),
    });
    this.title.set('');
    this.date.set('');
    this.capacity.set(10);
    this.desc.set('');
  }
}
