import { Component, signal } from '@angular/core';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
  selector: 'app-parent-search-demo',
  imports: [SearchBoxComponent],
  templateUrl: './parent-search-demo.component.html',
  styleUrl: './parent-search-demo.component.css',
})
export class ParentSearchDemoComponent {
  parentQuery = signal('');
}
