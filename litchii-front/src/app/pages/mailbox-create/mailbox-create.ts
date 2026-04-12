import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MailboxService } from '../../services/mailbox.service';
import { PinStorageService } from '../../services/pin-storage.service';

@Component({
  selector: 'app-mailbox-create',
  imports: [FormsModule],
  template: `
    <div class="create">
      @if (!created) {
        <div class="create-card">
          <span class="card-icon">📮</span>
          <h2>Nouvelle boîte aux lettres</h2>
          <p class="hint">Choisissez un PIN pour protéger votre boîte</p>
          <div class="input-group">
            <input
              type="password"
              maxlength="6"
              [(ngModel)]="pin"
              placeholder="• • • •"
              (keyup.enter)="onCreate()"
              autofocus
            />
            <span class="input-label">4 à 6 chiffres</span>
          </div>
          <button class="btn-primary" (click)="onCreate()" [disabled]="pin.length < 4">
            <span>Créer ma boîte</span>
          </button>
        </div>
      } @else {
        <div class="result-card">
          <span class="card-icon">🎉</span>
          <h2>Votre boîte est prête !</h2>

          <div class="info-block">
            <label>Lien à partager</label>
            <div class="link-row">
              <code>{{ shareLink }}</code>
              <button class="btn-copy" (click)="copyLink()">
                {{ copied ? '✓ Copié' : 'Copier' }}
              </button>
            </div>
          </div>

          <div class="info-block">
            <label>Votre PIN</label>
            <code class="pin-display">{{ pin }}</code>
          </div>

          <p class="warning">
            ⚠️ Conservez votre PIN — il ne sera plus affiché
          </p>

          <button class="btn-primary" (click)="goToMailbox()">
            <span>Accéder à ma boîte</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .create {
      display: flex;
      justify-content: center;
      padding-top: 3rem;
    }

    .create-card, .result-card {
      background: white;
      padding: 2.5rem 2rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--litchi-100);
      box-shadow: var(--shadow-md);
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.2rem;
    }

    .card-icon {
      font-size: 3rem;
    }

    h2 {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
    }

    .hint {
      color: var(--text-muted);
      font-size: 0.9rem;
      text-align: center;
    }

    .input-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
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

    .input-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-align: center;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.8rem;
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

    .info-block {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .link-row {
      display: flex;
      gap: 0.5rem;
      align-items: stretch;

      code {
        flex: 1;
        padding: 0.6rem 0.75rem;
        background: var(--cream);
        border: 1px solid var(--litchi-100);
        border-radius: var(--radius-sm);
        font-size: 0.75rem;
        word-break: break-all;
        display: flex;
        align-items: center;
      }
    }

    .btn-copy {
      padding: 0.6rem 1rem;
      background: var(--litchi-50);
      color: var(--litchi-600);
      border: 1px solid var(--litchi-200);
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 0.8rem;
      font-weight: 600;
      white-space: nowrap;
      transition: all 0.2s;

      &:hover {
        background: var(--litchi-100);
      }
    }

    .pin-display {
      padding: 0.6rem;
      background: var(--cream);
      border: 1px solid var(--litchi-100);
      border-radius: var(--radius-sm);
      font-size: 1.2rem;
      letter-spacing: 0.4rem;
      text-align: center;
    }

    .warning {
      font-size: 0.85rem;
      color: var(--litchi-700);
      font-weight: 500;
      text-align: center;
      padding: 0.6rem 1rem;
      background: var(--litchi-50);
      border-radius: var(--radius-sm);
      width: 100%;
    }
  `,
})
export class MailboxCreateComponent {
  pin = '';
  created = false;
  token = '';
  shareLink = '';
  copied = false;

  constructor(
    private mailboxService: MailboxService,
    private pinStorage: PinStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onCreate(): void {
    this.mailboxService.createMailbox(this.pin).subscribe((res) => {
      this.token = res.token;
      this.shareLink = `${window.location.origin}/m/${res.shortCode}`;
      this.created = true;
      this.pinStorage.setPin(this.pin);
      this.cdr.detectChanges();
    });
  }

  copyLink(): void {
    navigator.clipboard.writeText(this.shareLink);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  goToMailbox(): void {
    this.router.navigate(['/mailbox', this.token]);
  }
}