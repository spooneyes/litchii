import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PinStorageService } from '../services/pin-storage.service';

export const pinInterceptor: HttpInterceptorFn = (req, next) => {
  const pinStorage = inject(PinStorageService);
  const pin = pinStorage.getPin();

  if (pin && req.url.includes('/api/mailboxes')) {
    const cloned = req.clone({
      setHeaders: { 'X-Pin': pin },
    });
    return next(cloned);
  }

  return next(req);
};