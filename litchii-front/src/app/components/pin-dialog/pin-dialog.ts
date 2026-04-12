import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pin-dialog',
  imports: [FormsModule],
  template: `
    <div class="pin-wrapper">
      <div class="pin-card">
        <span class="pin-icon">🔐</span>
        <h3>Entrez le PIN</h3>
        <p class="pin-hint">Code à 4-6 chiffres</p>
        <input
          type="password"
          maxlength="6"
          [(ngModel)]="pin"
          placeholder="• • • •"
          (keyup.enter)="submit()"
          autofocus
        />
        @if (error) {
          <p class="error">PIN incorrect</p>
        }
        <button (click)="submit()" [disabled]="pin.length < 4">Déverrouiller</button>
      </div>
    </div>
  `,
  styles: `
    .pin-wrapper {
      display: flex;
      justify-content: center;
      padding-top: 4rem;
    }

    .pin-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      background: white;
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--litchi-100);
      box-shadow: var(--shadow-md);
      width: 100%;
      max-width: 320px;
    }

    .pin-icon {
      font-size: 2.5rem;
    }

    h3 {
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 600;
    }

    .pin-hint {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: -0.5rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      font-size: 1.4rem;
      letter-spacing: 0.5rem;
      text-align: center;
      border: 2px solid var(--litchi-200);
      border-radius: var(--radius-md);
      background: var(--cream);
      color: var(--text-primary);
      font-family: var(--font-body);
      outline: none;
      transition: border-color 0.3s;

      &:focus {
        border-color: var(--litchi-400);
      }
    }

    button {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, var(--litchi-500), var(--litchi-600));
      color: white;
      border: none;
      border-radius: var(--radius-pill);
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: var(--shadow-sm);

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .error {
      color: var(--litchi-600);
      font-size: 0.85rem;
      font-weight: 500;
      animation: shake 0.4s ease;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `,
})
export class PinDialogComponent {
  pin = '';
  error = false;

  @Output() pinSubmitted = new EventEmitter<string>();

  submit(): void {
    this.error = false;
    this.pinSubmitted.emit(this.pin);
  }

  showError(): void {
    this.error = true;
  }
}