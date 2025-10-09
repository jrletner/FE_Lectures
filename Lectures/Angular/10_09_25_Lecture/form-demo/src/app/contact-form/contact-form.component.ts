import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent {
  name = '';
  email = '';
  message = '';
  submitted = false;
  submit(form: NgForm) {
    this.submitted = true;
    if (form.invalid) return;
    console.log('[ContactForm]', {
      name: this.name,
      email: this.email,
      message: this.message,
    });
    form.resetForm();
    this.submitted = false;
  }
}
