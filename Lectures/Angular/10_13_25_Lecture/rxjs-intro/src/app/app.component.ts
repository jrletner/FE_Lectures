import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveSearchComponent } from './reactive-search/reactive-search.component';
import { AsyncDemoComponent } from './async-demo/async-demo.component';
import { ObserverDemoComponent } from './observer-demo/observer-demo.component';
import { ControlFlowDemoComponent } from './control-flow-demo/control-flow-demo.component';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveSearchComponent,
    AsyncDemoComponent,
    ObserverDemoComponent,
    ControlFlowDemoComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'rxjs-intro';
}
