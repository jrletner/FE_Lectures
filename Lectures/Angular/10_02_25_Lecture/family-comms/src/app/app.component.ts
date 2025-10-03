import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterParentComponent } from './examples/counter/counter-parent/counter-parent.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CounterParentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'family-comms';
}
