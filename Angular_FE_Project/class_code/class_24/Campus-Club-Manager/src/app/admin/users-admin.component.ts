import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../shared/services/users.service';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-admin.component.html',
  styleUrls: ['./users-admin.component.css'],
})
export class UsersAdminComponent implements OnInit {
  private svc = inject(UsersService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  users = signal<User[]>([]);
  busy = signal(false);
  message = '';

  showCreate = signal(false);
  createForm = { username: '', pin: '', isAdmin: false };

  editId = signal<string | null>(null);
  editForm = { username: '', isAdmin: false } as {
    username: string;
    isAdmin: boolean;
  };

  pinUser = signal<User | null>(null);
  pinForm = { pin: '', confirm: '' };

  ngOnInit(): void {
    this.load();
  }

  trackId = (_: number, u: User) => u.id;

  isSelf = (u: User) => this.auth.user()?.id === u.id;

  async load() {
    this.busy.set(true);
    try {
      const list = await this.svc.list();
      this.users.set(list);
    } catch (e: any) {
      this.toast.error(e?.error?.error || 'Failed to load users');
    } finally {
      this.busy.set(false);
    }
  }

  cancelCreate() {
    this.showCreate.set(false);
    this.createForm = { username: '', pin: '', isAdmin: false };
    this.message = '';
  }

  async create() {
    this.message = '';
    this.busy.set(true);
    try {
      if (!/^\d{4}$/.test(this.createForm.pin)) {
        throw { error: { error: 'PIN must be exactly 4 digits' } };
      }
      const u = await this.svc.create({
        username: this.createForm.username.trim(),
        pin: this.createForm.pin,
        isAdmin: this.createForm.isAdmin,
      });
      this.users.update((arr) => [...arr, u]);
      this.toast.success(`Created user “${u.username}”`);
      this.cancelCreate();
    } catch (e: any) {
      const msg = e?.error?.error || 'Failed to create user';
      this.toast.error(msg);
      this.message = msg;
    } finally {
      this.busy.set(false);
    }
  }

  startEdit(u: User) {
    this.editId.set(u.id);
    this.editForm = { username: u.username, isAdmin: !!u.isAdmin };
  }

  cancelEdit() {
    this.editId.set(null);
    this.message = '';
  }

  async saveEdit(u: User) {
    this.message = '';
    this.busy.set(true);
    try {
      const updated = await this.svc.update(u.id, {
        username: this.editForm.username.trim(),
        isAdmin: this.editForm.isAdmin,
      });
      this.users.update((arr) =>
        arr.map((x) => (x.id === u.id ? { ...x, ...updated } : x))
      );
      this.toast.success(`Updated user “${updated.username}”`);
      // If the currently logged-in user updated themselves, refresh auth user
      const me = this.auth.user();
      if (me && me.id === u.id) {
        this.auth.setUser({ ...me, ...updated });
        // If they removed their own admin role, they no longer can stay on this page
        if (!this.auth.isAdmin()) {
          this.router.navigateByUrl('/');
          return;
        }
      }
      this.cancelEdit();
    } catch (e: any) {
      const msg = e?.error?.error || 'Failed to update user';
      this.toast.error(msg);
      this.message = msg;
    } finally {
      this.busy.set(false);
    }
  }

  async remove(u: User) {
    if (this.isSelf(u)) {
      this.toast.error('Admins cannot delete themselves');
      return;
    }
    if (!confirm(`Delete user “${u.username}”?`)) return;
    this.busy.set(true);
    try {
      await this.svc.remove(u.id);
      this.users.update((arr) => arr.filter((x) => x.id !== u.id));
      this.toast.danger(`Deleted user “${u.username}”`);
    } catch (e: any) {
      const msg = e?.error?.error || 'Failed to delete user';
      this.toast.error(msg);
    } finally {
      this.busy.set(false);
    }
  }

  openPin(u: User) {
    this.pinUser.set(u);
    this.pinForm = { pin: '', confirm: '' };
    this.message = '';
  }

  closePin() {
    this.pinUser.set(null);
    this.pinForm = { pin: '', confirm: '' };
    this.message = '';
  }

  async applyPin() {
    const u = this.pinUser();
    if (!u) return;
    if (!/^\d{4}$/.test(this.pinForm.pin)) {
      this.message = 'PIN must be exactly 4 digits';
      return;
    }
    if (this.pinForm.pin !== this.pinForm.confirm) {
      this.message = 'PINs do not match';
      return;
    }
    this.busy.set(true);
    try {
      await this.svc.update(u.id, { pin: this.pinForm.pin });
      this.toast.success(`Updated PIN for “${u.username}”`);
      this.closePin();
    } catch (e: any) {
      const msg = e?.error?.error || 'Failed to update PIN';
      this.toast.error(msg);
      this.message = msg;
    } finally {
      this.busy.set(false);
    }
  }
}
