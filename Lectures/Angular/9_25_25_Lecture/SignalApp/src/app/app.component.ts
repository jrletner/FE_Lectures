import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CounterSignalComponent } from './counter-signal/counter-signal.component';
import { ColorDemoComponent } from './color-demo/color-demo.component';
import { ParentLikeDemoComponent } from './parent-like-demo/parent-like-demo.component';
import { ParentSearchDemoComponent } from './parent-search-demo/parent-search-demo.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CounterSignalComponent,
    ColorDemoComponent,
    ParentLikeDemoComponent,
    ParentSearchDemoComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'SignalApp';
}
