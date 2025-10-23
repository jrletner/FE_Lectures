import { HttpInterceptorFn } from '@angular/common/http';

// A functional interceptor that runs for every HTTP request
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // In real apps, retrieve token from a service or store
  const token = 'demo-token-abc';
  // Clone the request and add an Authorization header
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
  // Hand the modified request to the next handler in the chain
  return next(authReq);
};
