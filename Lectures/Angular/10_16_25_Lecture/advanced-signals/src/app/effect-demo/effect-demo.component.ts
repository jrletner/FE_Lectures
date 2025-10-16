import { Component, effect, signal } from '@angular/core';

@Component({
  selector: 'app-effect-demo',
  standalone: true,
  templateUrl: './effect-demo.component.html',
  styleUrl: './effect-demo.component.css',
})
export class EffectDemoComponent {
  value = signal(0);
  bump() {
    this.value.update((v) => v + 1);
  }

  constructor() {
    effect((onCleanup) => {
      console.log('value is', this.value());
      const id = setInterval(() => console.log('tick', Date.now()), 1000);
      onCleanup(() => clearInterval(id));
    });
  }
}
