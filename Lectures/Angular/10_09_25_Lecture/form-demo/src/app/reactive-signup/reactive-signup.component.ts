import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-reactive-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-signup.component.html',
  styleUrl: './reactive-signup.component.css',
})
export class ReactiveSignupComponent {
  submitted = false;
  signupForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
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
    console.log('[ReactiveSignup]', this.signupForm.getRawValue());
    this.signupForm.reset({ email: '', password: '', agree: false });
    this.submitted = false;
  }
}
