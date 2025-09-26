import { Component, signal } from '@angular/core';
import { LikeButtonComponent } from '../like-button/like-button.component';

@Component({
  selector: 'app-parent-like-demo',
  imports: [LikeButtonComponent],
  templateUrl: './parent-like-demo.component.html',
  styleUrl: './parent-like-demo.component.css',
})
export class ParentLikeDemoComponent {
  // I am the container that the button lives in

  // i need to update my text based off of child's value
  lastLiked = signal<boolean | null>(null);

  // when child emits i need to react
  onLikeChanged(liked: boolean) {
    this.lastLiked.set(liked);
  }
}
