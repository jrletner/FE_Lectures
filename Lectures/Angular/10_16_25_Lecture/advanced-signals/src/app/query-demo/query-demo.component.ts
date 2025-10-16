import { Component, ElementRef, effect, viewChild } from '@angular/core';

@Component({
  selector: 'app-query-demo',
  standalone: true,
  templateUrl: './query-demo.component.html',
  styleUrl: './query-demo.component.css',
})
export class QueryDemoComponent {
  titleEl = viewChild.required<ElementRef<HTMLHeadingElement>>('title');
  inputEl = viewChild<ElementRef<HTMLInputElement>>('name');

  constructor() {
    effect(() => {
      const el = this.inputEl();
      if (el) el.nativeElement.focus();
    });
  }
}
