import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClubService } from '../services/club.service';

@Component({
  selector: 'app-import-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './import-export.component.html',
  styleUrls: ['./import-export.component.css'],
})
export class ImportExportComponent {
  svc = inject(ClubService);
  msg = signal<string | null>(null);
  msgType = signal<'success' | 'error'>('success');
  fileName = signal<string>('');

  download() {
    const data = this.svc.exportJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clubs.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  async onFile(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.fileName.set(file.name);
    const text = await file.text();
    const res = this.svc.importJson(text);
    const ok = !!res.ok;
    this.msgType.set(ok ? 'success' : 'error');
    this.msg.set(ok ? 'Imported successfully' : res.message ?? 'Import failed');
    input.value = '';
    this.fileName.set('');
  }

  reset() {
    if (confirm('Reset all data?')) {
      this.svc.reset();
      this.msgType.set('success');
      this.msg.set('Reset complete');
    }
  }
}
