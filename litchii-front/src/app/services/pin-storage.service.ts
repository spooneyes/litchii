import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PinStorageService {
  private pin: string | null = null;

  setPin(pin: string): void {
    this.pin = pin;
  }

  getPin(): string | null {
    return this.pin;
  }

  clear(): void {
    this.pin = null;
  }
}