import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const pw = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  if (pw && cpw && pw !== cpw) return { passwordMismatch: true };
  return null;
}

@Component({
  selector: 'app-reactive-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-signup.component.html',
  styleUrl: './reactive-signup.component.css',
})
export class ReactiveSignupComponent {
  submitted = false;
  signupForm = new FormGroup(
    {
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)],
      }),
      confirmPassword: new FormControl('', {
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
    console.log('[ReactiveSignup]', this.signupForm.getRawValue());
    this.signupForm.reset({
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    });
    this.submitted = false;
  }
}
