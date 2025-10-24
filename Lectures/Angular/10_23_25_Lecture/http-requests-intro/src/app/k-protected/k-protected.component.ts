import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-k-protected',
  standalone: true,
  templateUrl: './k-protected.component.html',
  styleUrls: ['./k-protected.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KProtectedComponent {}
