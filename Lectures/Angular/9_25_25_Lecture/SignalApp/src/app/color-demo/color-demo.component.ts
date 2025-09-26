import { Component } from '@angular/core';
import { ColorBadgeComponent } from '../color-badge/color-badge.component';

@Component({
  selector: 'app-color-demo',
  imports: [ColorBadgeComponent],
  templateUrl: './color-demo.component.html',
  styleUrl: './color-demo.component.css',
})
export class ColorDemoComponent {}
