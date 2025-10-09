import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveSignupComponent } from './reactive-signup/reactive-signup.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'app-root',
  imports: [ReactiveSignupComponent, ContactFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'form-demo';
}
