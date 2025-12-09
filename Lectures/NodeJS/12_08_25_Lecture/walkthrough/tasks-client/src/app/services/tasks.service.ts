import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Task {
  _id?: string;
  name: string;
  completed?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  list(): Observable<Task[]> {
    return this.http
      .get<{ success: boolean; payload: Task[] }>(`${this.base}/api/v1/tasks`)
      .pipe(map((res) => res.payload));
  }

  get(id: string): Observable<Task> {
    return this.http
      .get<{ success: boolean; payload: Task }>(
        `${this.base}/api/v1/tasks/${id}`
      )
      .pipe(map((res) => res.payload));
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<{ success: boolean; payload: Task }>(
        `${this.base}/api/v1/tasks`,
        task
      )
      .pipe(map((res) => res.payload));
  }

  update(id: string, patch: Partial<Task>): Observable<Task> {
    return this.http
      .patch<{ success: boolean; payload: { updatedTask: Task } }>(
        `${this.base}/api/v1/tasks/${id}`,
        patch
      )
      .pipe(map((res) => res.payload.updatedTask));
  }

  remove(id: string): Observable<void> {
    return this.http
      .delete<{ success: boolean }>(`${this.base}/api/v1/tasks/${id}`)
      .pipe(map(() => void 0));
  }
}
