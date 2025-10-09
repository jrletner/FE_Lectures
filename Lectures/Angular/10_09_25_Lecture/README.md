_Full file replaced by forms intro._

<? Forms Intro README inserted above ?>

```typescript
import { Directive, EventEmitter, HostListener, Output } from "@angular/core";

@Directive({ selector: "[appDebounceInput]", standalone: true })
export class DebounceInputDirective {
  @Output() debounced = new EventEmitter<string>();
  private h?: any;
  @HostListener("input", ["$event.target.value"]) onInput(v: string) {
    clearTimeout(this.h);
    this.h = setTimeout(() => this.debounced.emit(v), 300);
  }
}
```

</details>

---

## Exercise 8: UpperFirst Pipe

Goal: Uppercase first character of each word.

<details>
<summary>Generate</summary>

```bash
ng g p upper-first --standalone --skip-tests
```

</details>

<details>
<summary>upper-first.pipe.ts</summary>

```typescript
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "upperFirst", standalone: true })
export class UpperFirstPipe implements PipeTransform {
  transform(v: string) {
    return (v || "").replace(/\b([a-z])/g, (m, c) => c.toUpperCase());
  }
}
```

</details>
