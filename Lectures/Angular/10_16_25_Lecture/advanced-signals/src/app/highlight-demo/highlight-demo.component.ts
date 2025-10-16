import { Component } from '@angular/core';
import { HighlightDirective } from '../highlight.directive';

@Component({
  selector: 'app-highlight-demo',
  standalone: true,
  imports: [HighlightDirective],
  templateUrl: './highlight-demo.component.html',
  styleUrl: './highlight-demo.component.css',
})
export class HighlightDemoComponent {}
