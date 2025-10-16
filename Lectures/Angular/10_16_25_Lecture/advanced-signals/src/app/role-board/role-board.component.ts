import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-role-board',
  standalone: true,
  templateUrl: './role-board.component.html',
  styleUrl: './role-board.component.css',
})
export class RoleBoardComponent {
  users = signal<readonly { id: number; name: string; role: 0 | 1 | 2 }[]>([
    { id: 1, name: 'Ada Lovelace', role: 0 },
    { id: 2, name: 'Linus Torvalds', role: 0 },
    { id: 3, name: 'Grace Hopper', role: 0 },
    { id: 4, name: 'Margaret Hamilton', role: 0 },
  ]);

  unassigned = computed(() => this.users().filter((u) => u.role === 0));
  admins = computed(() => this.users().filter((u) => u.role === 1));
  basics = computed(() => this.users().filter((u) => u.role === 2));

  onDragStart(ev: DragEvent, id: number) {
    ev.dataTransfer?.setData('text/plain', String(id));
    if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
  }
  allowDrop(ev: DragEvent) {
    ev.preventDefault();
    if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
  }
  onDrop(ev: DragEvent, bucket: 'admin' | 'basic' | 'unassigned') {
    ev.preventDefault();
    const data = ev.dataTransfer?.getData('text/plain');
    if (!data) return;
    const id = Number(data);
    const newRole: 0 | 1 | 2 =
      bucket === 'admin' ? 1 : bucket === 'basic' ? 2 : 0;
    this.users.update((curr) =>
      curr.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  }
}
