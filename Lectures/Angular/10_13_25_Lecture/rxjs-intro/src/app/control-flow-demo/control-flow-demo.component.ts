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
  showSorted = false;

  add(item: string) {
    if (item) this.items = [...this.items, item];
  }

  clear() {
    this.items = [];
  }

  trackItem(index: number, item: string) {
    return item;
  }

  get sortedItems(): string[] {
    return [...this.items].sort((a, b) => a.localeCompare(b));
  }

  get viewItems(): string[] {
    return this.showSorted ? this.sortedItems : this.items;
  }

  toggleSort() {
    this.showSorted = !this.showSorted;
  }
}
