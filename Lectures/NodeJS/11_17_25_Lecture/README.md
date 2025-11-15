# Student Practice Walkthrough – JWT Login API + Angular Client (Express + Angular 19.2.3)

In this lecture you’ll build a minimal login API with Express.js that issues a JWT, then create an Angular 19.2.3 frontend to test it. We’ll follow the same formatting style as 11_13_25: each exercise snippet is line-by-line commented, and a final compact backend composite appears at the end.

You will build 5 focused demos:

- Part A — Backend setup + global logging
- Part B — Login route that returns a JWT
- Part C — JWT verify middleware + protected profile route
- Part D — Angular 19.2.3 app to call the login API
- Part E — Final backend composite (uncommented)

---

## Why this matters

- Practice secure API patterns (issue and verify JWTs).
- Build a basic full-stack loop: frontend form → API → token → protected call.
- Keep backend simple and pedagogical with in-memory users.

## One-time setup (Backend)

```bash
npm init -y
npm install express jsonwebtoken cors
npm install -D nodemon
touch server.js
```

`package.json` scripts:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Run:

```bash
npm run dev
```

Backend runs on `http://localhost:3000`.

---

## Part A — Backend Setup + Global Logging

Goal: Create the Express server with JSON parsing and a simple logger to see requests.

<details><summary><code>part-a/server.js</code></summary>

```js
// 1) Import and init Express
const express = require("express"); // framework for building APIs
const app = express(); // create Express app instance

// 2) Enable JSON parsing
app.use(express.json()); // parse application/json into req.body

// 3) Global request logger
app.use((req, res, next) => {
  // basic logging middleware
  const ts = new Date().toISOString(); // timestamp for readability
  console.log(`[${ts}] ${req.method} ${req.url}`); // log method + path
  next(); // continue to routes
}); // end logger

// 4) Health endpoint
app.get("/ping", (req, res) => {
  // GET /ping
  res.json({ pong: true }); // return a small JSON body
}); // end /ping

// 5) Start server
app.listen(3000, () => {
  // listen on port 3000
  console.log("A: Server listening on http://localhost:3000"); // startup message
}); // end listen
```

</details>

### Run & Observe

- `GET /ping` returns `{ pong: true }` and prints a log line.

### Key Points

- Place logging before routes so all endpoints are covered.

---

## Part B — Login Route That Returns a JWT

Goal: Add a minimal in-memory users list and a `POST /auth/login` route that issues a JWT on valid credentials. For teaching simplicity, we’ll use plaintext passwords and keep data in memory.

<details><summary><code>part-b/models/users.js</code></summary>

```js
// Simple in-memory users store for demo only
let users = [
  // reset on restart
  {
    id: 1,
    email: "ada@example.com",
    name: "Ada",
    role: "admin",
    password: "password123",
  }, // seed admin
  {
    id: 2,
    email: "bao@example.com",
    name: "Bao",
    role: "user",
    password: "password123",
  }, // seed user
]; // end seed

function findByEmail(email) {
  // locate user by email
  return users.find((u) => u.email === email); // return matching user or undefined
} // end findByEmail

function publicProfile(u) {
  // non-sensitive fields
  return { id: u.id, email: u.email, name: u.name, role: u.role }; // strip password
} // end publicProfile

module.exports = { findByEmail, publicProfile }; // export helpers
```

</details>

<details><summary><code>part-b/routes/auth.js</code></summary>

```js
// Login route that returns a signed JWT
const express = require("express"); // import Express
const jwt = require("jsonwebtoken"); // token library
const Users = require("../models/users"); // users helper

const router = express.Router(); // Router instance
const SECRET = process.env.JWT_SECRET || "dev_jwt_secret"; // local secret for signing

// POST /auth/login { email, password }
router.post("/login", (req, res) => {
  // login endpoint
  const { email, password } = req.body; // read credentials
  if (!email || !password)
    // validate presence
    return res.status(400).json({ error: "email and password required" }); // 400 if missing

  const user = Users.findByEmail(email); // find user by email
  if (!user || user.password !== password)
    // naive password check (demo only)
    return res.status(401).json({ error: "Invalid credentials" }); // unauthorized

  const claims = {
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  }; // JWT claims
  const token = jwt.sign(claims, SECRET, { expiresIn: "1h" }); // sign token 1h expiry
  res.json({ token }); // respond with token
}); // end POST /auth/login

module.exports = router; // export router
```

</details>

<details><summary><code>part-b/server.js</code></summary>

```js
// Wire Part B login route into the server
const express = require("express"); // import Express
const authRouter = require("./routes/auth"); // import auth router
const app = express(); // new app instance

app.use(express.json()); // body parsing
app.use((req, res, next) => {
  console.log(`[LOGIN API] ${req.method} ${req.url}`);
  next();
}); // logger

app.use("/auth", authRouter); // mount at /auth

app.listen(3000, () => {
  // start server
  console.log("B: Login API on http://localhost:3000"); // startup message
}); // end listen
```

</details>

### Run & Observe

- POST `/auth/login` with valid credentials returns `{ token: "..." }`.
- Invalid credentials return 401.

### Key Points

- This is a teaching example; don’t store plaintext passwords in production.

---

## Part C — JWT Verify Middleware + Protected Route (with CORS)

Goal: Add a middleware that verifies `Authorization: Bearer <token>` and a protected route returning the caller’s profile (`/auth/me`).

<details><summary><code>part-c/middleware/jwt.js</code></summary>

```js
// Middleware to verify JWT and attach claims to req.user
const jwt = require("jsonwebtoken"); // tokenizer
const SECRET = process.env.JWT_SECRET || "dev_jwt_secret"; // shared secret

module.exports = function verifyJwt(req, res, next) {
  // exported middleware
  const h = req.header("authorization") || req.header("Authorization"); // read header
  if (!h || !h.startsWith("Bearer "))
    // require Bearer prefix
    return res.status(401).json({ error: "Missing Bearer token" }); // reject
  const token = h.slice(7); // remove 'Bearer '
  try {
    // verification
    req.user = jwt.verify(token, SECRET); // attach claims
    next(); // continue
  } catch (e) {
    // on error
    return res.status(401).json({ error: "Invalid or expired token" }); // reject
  } // end try/catch
}; // end middleware
```

</details>

<details><summary><code>part-c/routes/me.js</code></summary>

```js
// Protected profile endpoint
const express = require("express"); // import Express
const verifyJwt = require("../middleware/jwt"); // import verifier
const Users = require("../models/users"); // to shape public profile

const router = express.Router(); // Router instance

// GET /auth/me – requires Bearer token
router.get("/me", verifyJwt, (req, res) => {
  // protect with middleware
  res.json({
    user: Users.publicProfile({
      // return non-sensitive profile
      id: req.user.sub,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    }),
  }); // build from claims
}); // end /auth/me

module.exports = router; // export router
```

</details>

<details><summary><code>part-c/server.js</code></summary>

```js
// Mount /auth/login and /auth/me (now with CORS for Angular dev)
const express = require("express");
const cors = require("cors"); // enable cross-origin from Angular dev server
const authRouter = require("./routes/auth");
const meRouter = require("./routes/me");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200", // allow Angular CLI dev origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // match current server.js (allow auth headers/cookies)
  })
);
app.use((req, res, next) => {
  console.log(`[JWT API] ${req.method} ${req.url}`);
  next();
});

app.use("/auth", authRouter);
app.use("/auth", meRouter);

app.listen(3000, () => {
  console.log("C: JWT verify + /auth/me ready on :3000");
});
```

</details>

### Run & Observe

- Login to get a token, then call `/auth/me` with `Authorization: Bearer <token>`.

### Key Points

- Claims from the token drive identity without extra DB calls here.

---

## Part D — Angular 19.2.3 Client (Standalone Bootstrap) to Test the API

Goal: Generate an Angular app, add an AuthService, a LoginComponent with a form, and an interceptor that sends the JWT on `/auth/me` calls.

### One-time setup (Angular)

```bash
ng new jwt-login-client (css / N to SSR)
cd jwt-login-client
```

API base: `http://localhost:3000`.

### Environment file

```
ng generate environments
```

Optional: add `src/environments/` to `.gitignore`

<details><summary><code>src/environments/environment.ts</code></summary>

```ts
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:3000",
};
```

</details>

<details><summary><code>src/environments/environment.development.ts</code></summary>

```ts
export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:3000",
};
```

</details>

### Create Auth service

```bash
ng g s services/auth
```

<details><summary><code>src/app/services/auth.service.ts</code></summary>

```ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environments";

interface LoginResponse {
  token: string;
}
interface ProfileResponse {
  user: { id: number; email: string; name: string; role: string };
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private base = environment.apiBaseUrl;
  private tokenKey = "jwt_token";

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
```

</details>

### Add HTTP interceptor to attach Bearer token

```bash
ng g interceptor interceptors/auth
```

<details><summary><code>src/app/interceptors/auth.interceptor.ts</code></summary>

```ts
import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
```

</details>

We must provide HttpClient _with_ DI interceptors so the interceptor executes.

<details><summary><code>src/app/app.config.ts</code></summary>

```ts
import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";
import { BrowserModule } from "@angular/platform-browser";
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule), // import necessary Angular modules
    provideHttpClient(withInterceptorsFromDi()), // register HttpClient + DI interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, // attach auth interceptor
    provideZoneChangeDetection({ eventCoalescing: true }), // performance tweak
    provideRouter(routes), // application routes
  ],
};
```

</details>

### Create Login component

```bash
ng g c login
```

<details><summary><code>src/app/login/login.component.ts</code></summary>

```ts
import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  imports: [ReactiveFormsModule, JsonPipe], // standalone component imports
})
export class LoginComponent {
  message = "";
  profile: any = null;
  form: any;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ["ada@example.com", [Validators.required, Validators.email]],
      password: ["password123", [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value as {
      email: string;
      password: string;
    };
    this.message = "Logging in...";
    this.auth.login(email, password).subscribe({
      next: () => {
        this.message = "Logged in! Fetching profile...";
        this.auth.me().subscribe({
          next: (res) => {
            this.profile = res.user;
            this.message = "Profile loaded.";
          },
          error: (err) => {
            this.message =
              "Profile error: " + (err.error?.error || err.statusText);
          },
        });
      },
      error: (err) => {
        this.message = "Login error: " + (err.error?.error || err.statusText);
      },
    });
  }
}
```

</details>

<details><summary><code>src/app/login/login.component.html</code></summary>

```html
<h2>Login</h2>

<form [formGroup]="form" (ngSubmit)="submit()" class="form">
  <label>
    Email
    <input type="email" formControlName="email" />
  </label>

  <label>
    Password
    <input type="password" formControlName="password" />
  </label>

  <button type="submit" [disabled]="form.invalid">Login</button>
  <span style="margin-left: 8px;">{{ message }}</span>
</form>

@if (profile) {
<h3>Profile</h3>
<pre>{{ profile | json }}</pre>
}
```

</details>

Add the component to your `app.component.html` (standalone root component):

<details><summary><code>src/app/app.component.html</code></summary>

```html
<app-login></app-login>
```

</details>

### Run & Observe

- Run backend: `npm run dev` from your backend folder.
- Run Angular: `ng serve` from the Angular project, then open `http://localhost:4200`.
- Click Login; you should see a token saved and the profile rendered.

### Key Points

- Interceptor only runs because `withInterceptorsFromDi()` was supplied.
- CORS middleware enables Angular dev server calls without proxy.

### Troubleshooting

- 401 on `/auth/me`: Ensure token stored, interceptor registered, and `withInterceptorsFromDi()` included.
- CORS error: Confirm `cors` installed and `origin: http://localhost:4200` set, or configure proxy.
- NullInjectorError (HttpHandler): Happens if `provideHttpClient()` omitted or misconfigured.

---

## Part E — Final Backend Composite (Uncommented)

<details><summary><code>final/models/users.js</code></summary>

```js
let users = [
  {
    id: 1,
    email: "ada@example.com",
    name: "Ada",
    role: "admin",
    password: "password123",
  },
  {
    id: 2,
    email: "bao@example.com",
    name: "Bao",
    role: "user",
    password: "password123",
  },
];
const findByEmail = (e) => users.find((u) => u.email === e);
const publicProfile = (u) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
});
module.exports = { findByEmail, publicProfile };
```

</details>

<details><summary><code>final/middleware/jwt.js</code></summary>

```js
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
module.exports = function (req, res, next) {
  const h = req.header("authorization") || req.header("Authorization");
  if (!h || !h.startsWith("Bearer "))
    return res.status(401).json({ error: "Missing Bearer token" });
  const t = h.slice(7);
  try {
    req.user = jwt.verify(t, SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
```

</details>

<details><summary><code>final/routes/auth.js</code></summary>

```js
const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
const router = express.Router();
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  const u = Users.findByEmail(email);
  if (!u || u.password !== password)
    return res.status(401).json({ error: "Invalid credentials" });
  const claims = { sub: u.id, role: u.role, name: u.name, email: u.email };
  const token = jwt.sign(claims, SECRET, { expiresIn: "1h" });
  res.json({ token });
});
module.exports = router;
```

</details>

<details><summary><code>final/routes/me.js</code></summary>

```js
const express = require("express");
const verifyJwt = require("../middleware/jwt");
const Users = require("../models/users");
const router = express.Router();
router.get("/me", verifyJwt, (req, res) =>
  res.json({
    user: Users.publicProfile({
      id: req.user.sub,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    }),
  })
);
module.exports = router;
```

</details>

<details><summary><code>final/server.js</code></summary>

```js
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const meRouter = require("./routes/me");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});
app.use("/auth", authRouter);
app.use("/auth", meRouter);
app.listen(3000, () => console.log("Final: JWT login API on :3000"));
```

</details>

### Try It (REST Client)

```http
@baseUrl = http://localhost:3000
@json = application/json

### Login
POST {{baseUrl}}/auth/login
Content-Type: {{json}}

{
  "email": "ada@example.com",
  "password": "password123"
}

###

### Profile (replace token)
GET {{baseUrl}}/auth/me
Authorization: Bearer REPLACE_ME
```

---

End of JWT Login API + Angular Client walkthrough.
