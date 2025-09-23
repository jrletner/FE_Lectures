import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QuoteRotatorComponent } from './quote-rotator/quote-rotator.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, QuoteRotatorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'QuoteGenerator';
}
