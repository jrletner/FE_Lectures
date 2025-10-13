import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-control-flow-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './control-flow-demo.component.html',
  styleUrl: './control-flow-demo.component.css',
})
export class ControlFlowDemoComponent {
  items: string[] = ['apple', 'banana', 'cherry'];

  add(item: string) {
    if (item) this.items = [...this.items, item];
  }

  clear() {
    this.items = [];
  }

  trackItem(index: number, item: string) {
    return item;
  }
}
