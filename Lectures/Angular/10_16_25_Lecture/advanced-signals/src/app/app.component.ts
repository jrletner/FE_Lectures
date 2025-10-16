import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoleBoardComponent } from './role-board/role-board.component';
import { SignalCounterComponent } from './signal-counter/signal-counter.component';
import { ComputedDemoComponent } from './computed-demo/computed-demo.component';
import { LinkedDemoComponent } from './linked-demo/linked-demo.component';
import { ResourceDemoComponent } from './resource-demo/resource-demo.component';
import { InputCardComponent } from './input-card/input-card.component';
import { NameInputComponent } from './name-input/name-input.component';
import { ServiceCounterComponent } from './service-counter/service-counter.component';
import { HighlightDemoComponent } from './highlight-demo/highlight-demo.component';
import { QueryDemoComponent } from './query-demo/query-demo.component';
import { EffectDemoComponent } from './effect-demo/effect-demo.component';

@Component({
  selector: 'app-root',
  imports: [
    RoleBoardComponent,
    SignalCounterComponent,
    ComputedDemoComponent,
    LinkedDemoComponent,
    ResourceDemoComponent,
    InputCardComponent,
    NameInputComponent,
    ServiceCounterComponent,
    HighlightDemoComponent,
    QueryDemoComponent,
    EffectDemoComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  name = signal('');
  title = 'Advaned-Signals';
}
