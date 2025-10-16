import { Component, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resource-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './resource-demo.component.html',
  styleUrl: './resource-demo.component.css',
})
export class ResourceDemoComponent {
  username = signal('angular');
  user = resource({
    request: () => ({ user: this.username() }),
    loader: async ({ request }) => {
      const res = await fetch(`https://api.github.com/users/${request.user}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  });

  getErrorMessage(err: unknown): string {
    if (
      err &&
      typeof err === 'object' &&
      'message' in err &&
      typeof (err as any).message === 'string'
    ) {
      return (err as any).message as string;
    }
    return String(err ?? 'Unknown error');
  }
}
