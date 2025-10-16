import { Component, inject } from '@angular/core';
import { CounterService } from '../counter.service';

@Component({
  selector: 'app-service-counter',
  standalone: true,
  templateUrl: './service-counter.component.html',
  styleUrl: './service-counter.component.css',
})
export class ServiceCounterComponent {
  svc = inject(CounterService);
}
