import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-computed-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './computed-demo.component.html',
  styleUrl: './computed-demo.component.css',
})
export class ComputedDemoComponent {
  first = signal('Ada');
  last = signal('Lovelace');
  fullName = computed(() => `${this.first()} ${this.last()}`.trim());
}
