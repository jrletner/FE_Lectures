import { Directive, ElementRef, effect, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {
  color = input('yellow', { alias: 'appHighlight' });
  constructor(private el: ElementRef) {
    effect(() => {
      (this.el.nativeElement as HTMLElement).style.backgroundColor =
        this.color();
    });
  }
}
