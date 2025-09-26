import { Component, EventEmitter, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-like-button',
  imports: [],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.css',
})
export class LikeButtonComponent {
  // I am the button on the screen
  isLiked = signal(false);

  // I need to let parent know
  likeChanged = output<boolean>();

  // Effect example: automatically runs when isLiked changes
  likeEffect = effect(() => {
    console.log('Like status changed to:', this.isLiked());
    if (this.isLiked()) {
      console.log('❤️ Button is now liked!');
    } else {
      console.log('💔 Button is now unliked!');
    }
  });

  // Someone clicked me
  toggle() {
    // notify my button style
    this.isLiked.update((v) => !v);
    // notify my parent
    this.likeChanged.emit(this.isLiked());
  }
}
