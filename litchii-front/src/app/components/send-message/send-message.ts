import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MailboxService } from '../../services/mailbox.service';

@Component({
  selector: 'app-send-message',
  imports: [FormsModule],
  template: `
    <div class="send-card">
      <h3>Nouveau message</h3>

      <div class="field">
        <label for="sender">Votre nom</label>
        <input
          id="sender"
          type="text"
          [(ngModel)]="senderName"
          placeholder="Ex: Alice"
          maxlength="50"
        />
      </div>

      <div class="field">
        <label for="content">Message</label>
        <textarea
          id="content"
          [(ngModel)]="content"
          placeholder="Écrivez votre message..."
          rows="5"
          maxlength="5000"
        ></textarea>
      </div>

      <label class="file-label" [class.has-file]="selectedFile">
        <span class="file-icon">{{ selectedFile ? '✅' : '📎' }}</span>
        <span>{{ selectedFile ? selectedFile.name : 'Joindre une image' }}</span>
        <input type="file" accept="image/*" (change)="onFileSelect($event)" hidden />
      </label>

      <button
        class="btn-send"
        (click)="send()"
        [disabled]="!senderName || !content || sending"
      >
        {{ sending ? 'Envoi en cours...' : 'Envoyer' }}
      </button>

      @if (sent) {
        <div class="success">
          <span>✨</span>
          <p>Message envoyé avec succès !</p>
        </div>
      }
    </div>
  `,
  styles: `
    .send-card {
      background: white;
      padding: 1.5rem;
      border-radius: var(--radius-lg);
      border: 1px solid var(--litchi-100);
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    h3 {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 600;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;

      label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    input, textarea {
      padding: 0.7rem 0.85rem;
      border: 2px solid var(--litchi-100);
      border-radius: var(--radius-md);
      background: var(--cream);
      font-size: 0.95rem;
      font-family: var(--font-body);
      color: var(--text-primary);
      outline: none;
      transition: border-color 0.3s;

      &:focus {
        border-color: var(--litchi-400);
      }

      &::placeholder {
        color: var(--text-muted);
      }
    }

    textarea {
      resize: vertical;
      min-height: 100px;
      line-height: 1.5;
    }

    .file-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border: 2px dashed var(--litchi-200);
      border-radius: var(--radius-md);
      cursor: pointer;
      color: var(--text-muted);
      font-size: 0.9rem;
      transition: all 0.3s;

      &:hover {
        border-color: var(--litchi-400);
        color: var(--litchi-500);
        background: var(--litchi-50);
      }

      &.has-file {
        border-color: var(--litchi-300);
        border-style: solid;
        color: var(--litchi-600);
        background: var(--litchi-50);
      }
    }

    .file-icon {
      font-size: 1.1rem;
    }

    .btn-send {
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

    .success {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.7rem;
      background: var(--litchi-50);
      border-radius: var(--radius-sm);
      animation: fadeIn 0.3s ease;

      p {
        font-size: 0.9rem;
        color: var(--litchi-600);
        font-weight: 500;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
})
export class SendMessageComponent {
  @Input() token = '';
  @Output() messageSent = new EventEmitter<void>();

  senderName = '';
  content = '';
  selectedFile: File | null = null;
  sending = false;
  sent = false;

  constructor(private mailboxService: MailboxService,     private cdr: ChangeDetectorRef) {}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  send(): void {
    this.sending = true;
    this.mailboxService
      .sendMessage(this.token, this.senderName, this.content, this.selectedFile || undefined)
      .subscribe({
        next: () => {
          this.sending = false;
          this.sent = true;
          this.senderName = '';
          this.content = '';
          this.selectedFile = null;
          setTimeout(() => {
            this.sent = false;
            this.messageSent.emit();
            this.cdr.detectChanges();
          }, 1500);
          
        },
        error: () => {
          this.sending = false;
        },
      });
  }
}