import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  templateUrl: './error-banner.component.html',
  styleUrls: ['./error-banner.component.css'],
})
export class ErrorBannerComponent {
  @Input() message: string | null = null;
  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();
}
