import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token: string;
}
interface ProfileResponse {
  user: { id: number; email: string; name: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = environment.apiBaseUrl;
  private tokenKey = 'jwt_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.base}/auth/login`, { email, password })
      .pipe(tap((res) => localStorage.setItem(this.tokenKey, res.token)));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  me(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.base}/auth/me`);
  }
}
