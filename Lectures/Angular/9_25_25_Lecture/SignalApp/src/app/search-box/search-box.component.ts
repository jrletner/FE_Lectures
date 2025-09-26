import { Component, computed, model } from '@angular/core';

@Component({
  selector: 'app-search-box',
  imports: [],
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css',
})
export class SearchBoxComponent {
  query = model('');
  length = computed(() => this.query().length);
  valid = computed(() => this.length() >= 3);
}
