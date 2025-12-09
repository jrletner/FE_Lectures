import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TasksService, Task } from '../services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  form: any;

  constructor(private fb: FormBuilder, private api: TasksService) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
    });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.api.list().subscribe((tasks: Task[]) => {
      this.tasks = tasks ?? [];
    });
  }

  create() {
    if (this.form.invalid) return;
    const name = this.form.value.name as string;
    this.api.create({ name }).subscribe(() => {
      this.form.reset();
      this.refresh();
    });
  }

  toggle(t: Task) {
    const id = t._id as string;
    this.api
      .update(id, { completed: !t.completed })
      .subscribe(() => this.refresh());
  }

  remove(t: Task) {
    const id = t._id as string;
    this.api.remove(id).subscribe(() => this.refresh());
  }
}
