import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-color-badge',
  imports: [],
  templateUrl: './color-badge.component.html',
  styleUrl: './color-badge.component.css',
})
export class ColorBadgeComponent {
  color = input.required<string>();
}
