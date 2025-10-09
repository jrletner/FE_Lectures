# Student Practice Walkthrough – Angular 19 Forms (Reactive & Template-Driven)

## Before You Start: What Are The Two Form Types (Plain English)

There are two built‑in ways to build forms in Angular. They both end up collecting user input, but they start from opposite directions:

Reactive Forms (a.k.a. model‑driven):

1. You build the form structure in TypeScript (a FormGroup with FormControls).
2. The template just reflects what you already defined in code.
3. Validators are functions you attach in code.
4. Great when the form might grow, fields appear/disappear, you need custom or conditional rules, or you want easy unit tests.

Template‑Driven Forms:

1. You write normal HTML inputs and add directives like ngModel, name, required, email, minlength.
2. Angular scans the template and builds the form model for you under the hood.
3. Validation mostly declared with simple HTML attributes.
4. Great for very small, simple forms where you just need to grab a few fields quickly.

Simple rule of thumb:

- If you think “this form is tiny and won’t get fancy” → template‑driven is perfectly fine.
- If you think “I might add more logic, dynamic fields, complex validation, or tests” → start with reactive.

In this practice you’ll build one of each so you can FEEL the differences. Neither is “better” all the time—they just fit different sizes/complexities.

You will build TWO small forms yourself:

1. Reactive Signup (email, password, terms checkbox)
2. Template-Driven Contact (name, email, message)

Each has explicit goals & checkpoints. Read the HINTS only if you get stuck.

---

## Prerequisites

Project created (e.g. `forms-intro`) and dev server running:

```bash
ng serve --open
```

If not created:

```bash
ng new forms-intro --skip-tests
cd forms-intro
```

---

## Part A: Reactive Signup Form

**Goal:** A form that prevents submit until valid and shows errors after touch or submit attempt.

### A1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component reactive-signup --skip-tests
```

</details>

Add selector `<app-reactive-signup></app-reactive-signup>` to your root template.

### A2. Import Module

<details><summary><code>src/app/reactive-signup/reactive-signup.component.ts</code> (Decorator Snippet)</summary>

```ts
@Component({
  // ...
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-signup.component.html'
})
```

</details>

In the new component decorator add `imports: [ReactiveFormsModule]`.

### A3. Define the Form Model

Create a `FormGroup` with three controls:

- `email` (string) required + email
- `password` (string) required + minLength 6
- `agree` (boolean) requiredTrue

Add a `submitted` boolean (or `attempted` signal) to track first submit.

<details><summary><code>src/app/reactive-signup/reactive-signup.component.ts</code> (Form Model)</summary>

```ts
signupForm = new FormGroup({
  email: new FormControl("", {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
  password: new FormControl("", {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(6)],
  }),
  agree: new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  }),
});
submitted = false;
```

</details>

### A4. Template Markup

Inside `<form [formGroup]="signupForm" (ngSubmit)="submit()" novalidate>` create:

- Input for `email` -> `formControlName="email"`
- Input for `password` -> `formControlName="password"`
- Checkbox for `agree` -> `formControlName="agree"`
- Button `[disabled]="signupForm.invalid"`

Display each field's validation errors ONLY if (field.touched || submitted) AND errors present.

<details><summary><code>src/app/reactive-signup/reactive-signup.component.html</code> (Template)</summary>

```html
<form [formGroup]="signupForm" (ngSubmit)="submit()" novalidate>
  <label
    >Email
    <input formControlName="email" type="email" />
  </label>
  @if ((signupForm.get('email')?.touched || submitted) &&
  signupForm.get('email')?.errors) { @if
  (signupForm.get('email')?.errors?.['required']) {
  <small class="error">Email required</small> } @if
  (signupForm.get('email')?.errors?.['email']) {
  <small class="error">Invalid email</small> } }
  <label
    >Password
    <input formControlName="password" type="password" />
  </label>
  @if ((signupForm.get('password')?.touched || submitted) &&
  signupForm.get('password')?.errors) { @if
  (signupForm.get('password')?.errors?.['required']) {
  <small class="error">Password required</small> } @if
  (signupForm.get('password')?.errors?.['minlength']) {
  <small class="error">Min 6 chars</small> } }
  <label class="checkbox">
    <input formControlName="agree" type="checkbox" /> I agree to terms
  </label>
  @if ((signupForm.get('agree')?.touched || submitted) &&
  signupForm.get('agree')?.errors?.['required']) {
  <small class="error">You must agree</small>
  }
  <button type="submit" [disabled]="signupForm.invalid">Create Account</button>
</form>
```

</details>

### A5. Submit Logic

`submit()`:

1. Set `submitted = true`.
2. If invalid: `markAllAsTouched()` and return.
3. Log the form value to console.
4. Reset form to pristine defaults.
5. Reset `submitted` flag.

<details><summary><code>src/app/reactive-signup/reactive-signup.component.ts</code> (Submit Method)</summary>

```ts
submit(): void {
  this.submitted = true;
  if (this.signupForm.invalid) { this.signupForm.markAllAsTouched(); return; }
  console.log('[ReactiveSignup]', this.signupForm.getRawValue());
  this.signupForm.reset({ email: '', password: '', agree: false });
  this.submitted = false;
}
```

</details>

### A6. Style (Optional)

Add simple CSS: labels block, red `.error` text, padding on form.

<details><summary><code>src/app/reactive-signup/reactive-signup.component.css</code></summary>

```css
form {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
label {
  display: block;
  margin: 0.5rem 0;
}
.error {
  color: #c62828;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.15rem;
}
```

</details>

### A7. Run & Observe

Try:

- Submitting empty form (should block + show errors)
- Filling invalid email
- Too short password
- Unchecked terms
- Valid submission (console logs value, form resets)

### A8. Stretch (Optional)

Add a confirmPassword control with a custom validator comparing password.

<details><summary><code>HINTS – reactive-signup</code></summary>
<br>
<details><summary><code>src/app/reactive-signup/reactive-signup.component.ts (Hint Solution)</code></summary>

```ts
// Add a confirmPassword control + group-level validator
import { AbstractControl, ValidationErrors } from "@angular/forms";

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pw = group.get("password")?.value;
  const cpw = group.get("confirmPassword")?.value;
  if (pw && cpw && pw !== cpw) return { passwordMismatch: true };
  return null;
}

signupForm = new FormGroup(
  {
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    confirmPassword: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    agree: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  },
  { validators: [matchPasswords] }
);
```

</details>

<details><summary><code>src/app/reactive-signup/reactive-signup.component.html (Hint Solution)</code></summary>

```html
<!-- Insert near other password errors -->
@if ((submitted || signupForm.get('confirmPassword')?.touched) &&
signupForm.errors?.['passwordMismatch']) {
<small class="error">Passwords must match</small>
}
```

</details>

<details><summary><code>src/app/reactive-signup/reactive-signup.component.css (final – base)</code></summary>

```css
form {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
label {
  display: block;
  margin: 0.5rem 0;
}
.error {
  color: #c62828;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.15rem;
}
```

</details>

</details>

---

## Part B: Template-Driven Contact Form

**Goal:** A template-driven form with validation using directives and `ngModel`.

### B1. Generate Component

<details><summary>Commands</summary>

```bash
ng g component contact-form --skip-tests
```

</details>

<details><summary><code>src/app/reactive-signup/reactive-signup.component.ts (solution)</code></summary>

```ts
import { Component } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pw = group.get("password")?.value;
  const cpw = group.get("confirmPassword")?.value;
  if (pw && cpw && pw !== cpw) return { passwordMismatch: true };
  return null;
}

@Component({
  selector: "app-reactive-signup",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./reactive-signup.component.html",
  styleUrl: "./reactive-signup.component.css",
})
export class ReactiveSignupComponent {
  submitted = false;
  signupForm = new FormGroup(
    {
      email: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      agree: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    { validators: [matchPasswords] }
  );

  submit(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    console.log("[ReactiveSignup]", this.signupForm.getRawValue());
    this.signupForm.reset({
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    });
    this.submitted = false;
  }
}
```

</details>

<details><summary><code>src/app/reactive-signup/reactive-signup.component.html (solution)</code></summary>

```html
<form [formGroup]="signupForm" (ngSubmit)="submit()" novalidate>
  <label
    >Email
    <input formControlName="email" type="email" />
  </label>
  @if ((signupForm.get('email')?.touched || submitted) &&
  signupForm.get('email')?.errors) { @if
  (signupForm.get('email')?.errors?.['required']) {
  <small class="error">Email required</small> } @if
  (signupForm.get('email')?.errors?.['email']) {
  <small class="error">Invalid email</small> } }

  <label
    >Password
    <input formControlName="password" type="password" />
  </label>
  @if ((signupForm.get('password')?.touched || submitted) &&
  signupForm.get('password')?.errors) { @if
  (signupForm.get('password')?.errors?.['required']) {
  <small class="error">Password required</small> } @if
  (signupForm.get('password')?.errors?.['minlength']) {
  <small class="error">Min 6 chars</small> } }

  <label
    >Confirm Password
    <input formControlName="confirmPassword" type="password" />
  </label>
  @if ((signupForm.get('confirmPassword')?.touched || submitted) &&
  signupForm.get('confirmPassword')?.errors) { @if
  (signupForm.get('confirmPassword')?.errors?.['required']) {
  <small class="error">Confirm required</small> } } @if ((submitted ||
  signupForm.get('confirmPassword')?.touched) &&
  signupForm.errors?.['passwordMismatch']) {
  <small class="error">Passwords must match</small>
  }

  <label class="checkbox">
    <input formControlName="agree" type="checkbox" /> I agree to terms
  </label>
  @if ((signupForm.get('agree')?.touched || submitted) &&
  signupForm.get('agree')?.errors?.['required']) {
  <small class="error">You must agree</small>
  }

  <button type="submit" [disabled]="signupForm.invalid">Create Account</button>
</form>
```

</details>

<details><summary><code>src/app/reactive-signup/reactive-signup.component.css (solution)</code></summary>

```css
form {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
label {
  display: block;
  margin: 0.5rem 0;
}
.error {
  color: #c62828;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.15rem;
}
```

</details>

Add selector `<app-contact-form></app-contact-form>` to root template.

### B2. Import Module

Decorator: `imports: [FormsModule]`.

<details><summary><code>src/app/contact-form/contact-form.component.ts</code> (Decorator Snippet)</summary>

```ts
@Component({
  // ...
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-form.component.html'
})
```

</details>

<details><summary><code>src/app/contact-form/contact-form.component.ts (solution)</code></summary>

```ts
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";

@Component({
  selector: "app-contact-form",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./contact-form.component.html",
  styleUrl: "./contact-form.component.css",
})
export class ContactFormComponent {
  name = "";
  email = "";
  message = "";
  submitted = false;

  submit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;
    console.log("[ContactForm]", {
      name: this.name,
      email: this.email,
      message: this.message,
    });
    form.resetForm();
    this.submitted = false;
  }
}
```

</details>

<details><summary><code>src/app/contact-form/contact-form.component.html (solution)</code></summary>

```html
<form #form="ngForm" (ngSubmit)="submit(form)" novalidate>
  <label
    >Name
    <input name="name" [(ngModel)]="name" required #nameCtrl="ngModel" />
  </label>
  @if ((nameCtrl.touched || submitted) && nameCtrl.errors?.['required']) {
  <small class="error">Name required</small> }

  <label
    >Email
    <input
      name="email"
      type="email"
      [(ngModel)]="email"
      required
      email
      #emailCtrl="ngModel"
    />
  </label>
  @if ((emailCtrl.touched || submitted) && emailCtrl.errors) { @if
  (emailCtrl.errors['required']) { <small class="error">Email required</small> }
  @if (emailCtrl.errors['email']) { <small class="error">Invalid email</small> }
  }

  <label
    >Message
    <textarea
      name="message"
      [(ngModel)]="message"
      required
      minlength="10"
      maxlength="200"
      #msgCtrl="ngModel"
    ></textarea>
  </label>
  @if ((msgCtrl.touched || submitted) && msgCtrl.errors) { @if
  (msgCtrl.errors['required']) { <small class="error">Message required</small> }
  @if (msgCtrl.errors['minlength']) {
  <small class="error">Min 10 chars</small> } }
  <p class="muted">{{ (message || "").length }}/200</p>

  <button type="submit" [disabled]="form.invalid">Send</button>
</form>
```

</details>

<details><summary><code>src/app/contact-form/contact-form.component.css (solution)</code></summary>

```css
form {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
label {
  display: block;
  margin: 0.5rem 0;
}
.error {
  color: #c62828;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.15rem;
}
.muted {
  font-size: 0.65rem;
  color: #555;
  margin: 0.25rem 0 0.5rem;
}
```

</details>

### B3. Component State

Add three properties: `name = ''`, `email = ''`, `message = ''`; plus `submitted = false`.

<details><summary><code>src/app/contact-form/contact-form.component.ts</code> (State)</summary>

```ts
name = "";
email = "";
message = "";
submitted = false;
```

</details>

### B4. Template Markup

`<form #form="ngForm" (ngSubmit)="submit(form)" novalidate>` contains:

- Name input `name="name" [(ngModel)]="name" required #nameCtrl="ngModel"`
- Email input `name="email" type="email" [(ngModel)]="email" required email #emailCtrl="ngModel"`
- Message textarea `name="message" [(ngModel)]="message" required minlength="10" #msgCtrl="ngModel"`
- Submit button `[disabled]="form.invalid"`

Show error messages when `(control.touched || submitted)` and error present.

<details><summary><code>src/app/contact-form/contact-form.component.html</code> (Template)</summary>

```html
<form #form="ngForm" (ngSubmit)="submit(form)" novalidate>
  <label
    >Name
    <input name="name" [(ngModel)]="name" required #nameCtrl="ngModel" />
  </label>
  @if ((nameCtrl.touched || submitted) && nameCtrl.errors?.['required']) {
  <small class="error">Name required</small> }
  <label
    >Email
    <input
      name="email"
      type="email"
      [(ngModel)]="email"
      required
      email
      #emailCtrl="ngModel"
    />
  </label>
  @if ((emailCtrl.touched || submitted) && emailCtrl.errors) { @if
  (emailCtrl.errors['required']) { <small class="error">Email required</small> }
  @if (emailCtrl.errors['email']) { <small class="error">Invalid email</small> }
  }
  <label
    >Message
    <textarea
      name="message"
      [(ngModel)]="message"
      required
      minlength="10"
      #msgCtrl="ngModel"
    ></textarea>
  </label>
  @if ((msgCtrl.touched || submitted) && msgCtrl.errors) { @if
  (msgCtrl.errors['required']) { <small class="error">Message required</small> }
  @if (msgCtrl.errors['minlength']) {
  <small class="error">Min 10 chars</small> } }
  <button type="submit" [disabled]="form.invalid">Send</button>
</form>
```

</details>

### B5. Submit Logic

`submit(form: NgForm)`:

1. `submitted = true`.
2. If `form.invalid` return.
3. Log `{ name, email, message }`.
4. `form.resetForm()`.
5. `submitted = false`.

<details><summary><code>src/app/contact-form/contact-form.component.ts</code> (Submit Method)</summary>

```ts
submit(form: any) {
  this.submitted = true;
  if (form.invalid) return;
  console.log('[ContactForm]', { name: this.name, email: this.email, message: this.message });
  form.resetForm();
  this.submitted = false;
}
```

</details>

### B6. Run & Observe

Trigger each validation path (empty, invalid email, short message, success).

### B7. Stretch (Optional)

Add a character counter under the message: `{{ (message || "").length }}/200` and cap length.

<details><summary><code>src/app/contact-form/contact-form.component.ts (Hint Solution)</code></summary>

```ts
// Full minimal working component
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";

@Component({
  selector: "app-contact-form",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./contact-form.component.html",
})
export class ContactFormComponent {
  name = "";
  email = "";
  message = "";
  submitted = false;
  submit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;
    console.log("[ContactForm]", {
      name: this.name,
      email: this.email,
      message: this.message,
    });
    form.resetForm();
    this.submitted = false;
  }
}
```

</details>

<details><summary><code>src/app/contact-form/contact-form.component.html (Hint Solution)</code></summary>

```html
<!-- Character counter + errors showcase -->
<p class="muted">{{ (message || "").length }}/200</p>
```

</details>

<details><summary><code>src/app/contact-form/contact-form.component.css (final)</code></summary>

```css
form {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
label {
  display: block;
  margin: 0.5rem 0;
}
.error {
  color: #c62828;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.15rem;
}
.muted {
  font-size: 0.65rem;
  color: #555;
  margin: 0.25rem 0 0.5rem;
}
```

</details>

</details>

---

## Final Code (No Comments) – Copy/Paste Reference

### Reactive Signup (Base Version)

<details><summary><code>src/app/reactive-signup/reactive-signup.component.ts (final – base)</code></summary>

```ts
import { Component } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-reactive-signup",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./reactive-signup.component.html",
  styleUrl: "./reactive-signup.component.css",
})
export class ReactiveSignupComponent {
  submitted = false;
  signupForm = new FormGroup({
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
    agree: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  });
  submit(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    console.log("[ReactiveSignup]", this.signupForm.getRawValue());
    this.signupForm.reset({ email: "", password: "", agree: false });
    this.submitted = false;
  }
}
```

</details>

<details><summary><code>src/app/reactive-signup/reactive-signup.component.html (final – base)</code></summary>

```html
<form [formGroup]="signupForm" (ngSubmit)="submit()" novalidate>
  <label
    >Email
    <input formControlName="email" type="email" />
  </label>
  @if ((signupForm.get('email')?.touched || submitted) &&
  signupForm.get('email')?.errors) { @if
  (signupForm.get('email')?.errors?.['required']) {
  <small class="error">Email required</small> } @if
  (signupForm.get('email')?.errors?.['email']) {
  <small class="error">Invalid email</small> } }
  <label
    >Password
    <input formControlName="password" type="password" />
  </label>
  @if ((signupForm.get('password')?.touched || submitted) &&
  signupForm.get('password')?.errors) { @if
  (signupForm.get('password')?.errors?.['required']) {
  <small class="error">Password required</small> } @if
  (signupForm.get('password')?.errors?.['minlength']) {
  <small class="error">Min 6 chars</small> } }
  <label class="checkbox">
    <input formControlName="agree" type="checkbox" /> I agree to terms
  </label>
  @if ((signupForm.get('agree')?.touched || submitted) &&
  signupForm.get('agree')?.errors?.['required']) {
  <small class="error">You must agree</small>
  }
  <button type="submit" [disabled]="signupForm.invalid">Create Account</button>
</form>
```

</details>

<details><summary><code>src/app/reactive-signup/reactive-signup.component.css (final – base)</code></summary>

```css
form {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
label {
  display: block;
  margin: 0.5rem 0;
}
.error {
  color: #c62828;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.15rem;
}
```

</details>

### Reactive Signup (Stretch: Confirm Password)

<details><summary><code>src/app/reactive-signup/reactive-signup.component.ts (final – stretch)</code></summary>

```ts
import { Component } from "@angular/core";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pw = group.get("password")?.value;
  const cpw = group.get("confirmPassword")?.value;
  if (pw && cpw && pw !== cpw) return { passwordMismatch: true };
  return null;
}

@Component({
  selector: "app-reactive-signup",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./reactive-signup.component.html",
  styleUrl: "./reactive-signup.component.css",
})
export class ReactiveSignupComponent {
  submitted = false;
  signupForm = new FormGroup(
    {
      email: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      agree: new FormControl(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue],
      }),
    },
    { validators: [matchPasswords] }
  );
  submit(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    console.log("[ReactiveSignup]", this.signupForm.getRawValue());
    this.signupForm.reset({
      email: "",
      password: "",
      confirmPassword: "",
      agree: false,
    });
    this.submitted = false;
  }
}
```

</details>

<details><summary><code>src/app/reactive-signup/reactive-signup.component.html (final – stretch)</code></summary>

```html
<form [formGroup]="signupForm" (ngSubmit)="submit()" novalidate>
  <label
    >Email
    <input formControlName="email" type="email" />
  </label>
  @if ((signupForm.get('email')?.touched || submitted) &&
  signupForm.get('email')?.errors) { @if
  (signupForm.get('email')?.errors?.['required']) {
  <small class="error">Email required</small> } @if
  (signupForm.get('email')?.errors?.['email']) {
  <small class="error">Invalid email</small> } }
  <label
    >Password
    <input formControlName="password" type="password" />
  </label>
  @if ((signupForm.get('password')?.touched || submitted) &&
  signupForm.get('password')?.errors) { @if
  (signupForm.get('password')?.errors?.['required']) {
  <small class="error">Password required</small> } @if
  (signupForm.get('password')?.errors?.['minlength']) {
  <small class="error">Min 6 chars</small> } }
  <label
    >Confirm Password
    <input formControlName="confirmPassword" type="password" />
  </label>
  @if ((signupForm.get('confirmPassword')?.touched || submitted) &&
  signupForm.get('confirmPassword')?.errors) { @if
  (signupForm.get('confirmPassword')?.errors?.['required']) {
  <small class="error">Confirm required</small> } } @if ((submitted ||
  signupForm.get('confirmPassword')?.touched) &&
  signupForm.errors?.['passwordMismatch']) {
  <small class="error">Passwords must match</small>
  }
  <label class="checkbox">
    <input formControlName="agree" type="checkbox" /> I agree to terms
  </label>
  @if ((signupForm.get('agree')?.touched || submitted) &&
  signupForm.get('agree')?.errors?.['required']) {
  <small class="error">You must agree</small>
  }
  <button type="submit" [disabled]="signupForm.invalid">Create Account</button>
</form>
```

</details>

<details><summary><code>src/app/reactive-signup/reactive-signup.component.css (final – stretch)</code></summary>

```css
form {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
label {
  display: block;
  margin: 0.5rem 0;
}
.error {
  color: #c62828;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.15rem;
}
```

</details>

### Template-Driven Contact Form

<details><summary><code>src/app/contact-form/contact-form.component.ts (final)</code></summary>

```ts
import { Component } from "@angular/core";
import { FormsModule, NgForm } from "@angular/forms";

@Component({
  selector: "app-contact-form",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./contact-form.component.html",
  styleUrl: "./contact-form.component.css",
})
export class ContactFormComponent {
  name = "";
  email = "";
  message = "";
  submitted = false;
  submit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;
    console.log("[ContactForm]", {
      name: this.name,
      email: this.email,
      message: this.message,
    });
    form.resetForm();
    this.submitted = false;
  }
}
```

</details>

<details><summary><code>src/app/contact-form/contact-form.component.html (final)</code></summary>

```html
<form #form="ngForm" (ngSubmit)="submit(form)" novalidate>
  <label
    >Name
    <input name="name" [(ngModel)]="name" required #nameCtrl="ngModel" />
  </label>
  @if ((nameCtrl.touched || submitted) && nameCtrl.errors?.['required']) {
  <small class="error">Name required</small> }
  <label
    >Email
    <input
      name="email"
      type="email"
      [(ngModel)]="email"
      required
      email
      #emailCtrl="ngModel"
    />
  </label>
  @if ((emailCtrl.touched || submitted) && emailCtrl.errors) { @if
  (emailCtrl.errors['required']) { <small class="error">Email required</small> }
  @if (emailCtrl.errors['email']) { <small class="error">Invalid email</small> }
  }
  <label
    >Message
    <textarea
      name="message"
      [(ngModel)]="message"
      required
      minlength="10"
      maxlength="200"
      #msgCtrl="ngModel"
    ></textarea>
  </label>
  @if ((msgCtrl.touched || submitted) && msgCtrl.errors) { @if
  (msgCtrl.errors['required']) { <small class="error">Message required</small> }
  @if (msgCtrl.errors['minlength']) {
  <small class="error">Min 10 chars</small> } }
  <p class="muted">{{ (message || "").length }}/200</p>
  <button type="submit" [disabled]="form.invalid">Send</button>
</form>
```

</details>

<details><summary><code>src/app/contact-form/contact-form.component.css (final)</code></summary>

```css
form {
  border: 1px solid #ddd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
}
label {
  display: block;
  margin: 0.5rem 0;
}
.error {
  color: #c62828;
  font-size: 0.75rem;
  display: block;
  margin-top: 0.15rem;
}
.muted {
  font-size: 0.65rem;
  color: #555;
  margin: 0.25rem 0 0.5rem;
}
```

</details>

Happy building! 🚀
