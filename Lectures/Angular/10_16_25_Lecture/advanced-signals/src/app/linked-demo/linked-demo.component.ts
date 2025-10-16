import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-linked-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './linked-demo.component.html',
  styleUrl: './linked-demo.component.css',
})
export class LinkedDemoComponent {
  priceCents = signal(1299);
  price = computed(() => (this.priceCents() / 100).toFixed(2));

  setPrice(dollars: string) {
    const n = Number(dollars);
    if (!Number.isFinite(n)) return;
    this.priceCents.set(Math.round(n * 100));
  }
}
