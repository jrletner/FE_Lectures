import { Component, input } from '@angular/core';

@Component({
  selector: 'app-input-card',
  standalone: true,
  templateUrl: './input-card.component.html',
  styleUrl: './input-card.component.css',
})
export class InputCardComponent {
  title = input('Title from Parent to Child');
  subtitle = input('Subtitle from Parent to Child');
}
