import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, JsonPipe], // standalone component imports
})
export class LoginComponent {
  message = '';
  profile: any = null;
  form: any;
  isLoggedIn = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['ada@example.com', [Validators.required, Validators.email]],
      password: ['password123', [Validators.required]],
    });
  }

  logout() {
    this.auth.logout();
    this.profile = null;
    this.message = 'Logged Out!';
    this.isLoggedIn = false;
  }

  submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value as {
      email: string;
      password: string;
    };
    this.message = 'Logging in...';
    this.auth.login(email, password).subscribe({
      next: () => {
        this.isLoggedIn = true;
        this.message = 'Logged in! Fetching profile...';
        this.auth.me().subscribe({
          next: (res) => {
            this.profile = res.user;
            this.message = 'Profile loaded.';
          },
          error: (err) => {
            this.message =
              'Profile error: ' + (err.error?.error || err.statusText);
          },
        });
      },
      error: (err) => {
        this.message = 'Login error: ' + (err.error?.error || err.statusText);
      },
    });
  }
}
