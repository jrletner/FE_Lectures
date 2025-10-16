import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-name-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './name-input.component.html',
  styleUrl: './name-input.component.css',
})
export class NameInputComponent {
  value = model('');
}
