import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageFull } from '../../services/mailbox.service';

@Component({
  selector: 'app-message-full',
  imports: [DatePipe],
  template: `
    <div class="full-card">
      <button class="back" (click)="closed.emit()">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Retour
      </button>

      <div class="message-card">
        <div class="msg-header">
          <div class="avatar">{{ message.senderName.charAt(0).toUpperCase() }}</div>
          <div>
            <strong>{{ message.senderName }}</strong>
            <span class="date">{{ message.createdAt | date:'medium' }}</span>
          </div>
        </div>

        <p class="content">{{ message.content }}</p>

        @if (message.imageBase64) {
  <img [src]="'data:image/jpeg;base64,' + message.imageBase64" alt="Image jointe" />
}

        <div class="notice">
          <span>🔥</span>
          <p>Ce message a été supprimé après lecture</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .full-card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .back {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: none;
      border: none;
      color: var(--litchi-600);
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 0.9rem;
      font-weight: 500;
      padding: 0.3rem 0;
      transition: color 0.2s;

      &:hover {
        color: var(--litchi-700);
      }
    }

    .message-card {
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    border: 1px solid var(--litchi-100);
    box-shadow: var(--shadow-md);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    overflow: hidden;
}

    .msg-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      strong {
        display: block;
        font-size: 1rem;
      }

      .date {
        font-size: 0.75rem;
        color: var(--text-muted);
      }
    }

    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--litchi-300), var(--litchi-400));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.1rem;
    }

    .content {
    line-height: 1.7;
    font-size: 0.95rem;
    color: var(--text-primary);
    word-break: break-word;
    overflow-wrap: break-word;
}

    img {
      width: 100%;
      border-radius: var(--radius-md);
      border: 1px solid var(--litchi-100);
    }

    .notice {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1rem;
      background: var(--litchi-50);
      border-radius: var(--radius-sm);
      border: 1px solid var(--litchi-100);

      p {
        font-size: 0.8rem;
        color: var(--litchi-700);
        font-weight: 500;
      }
    }
  `,
})
export class MessageFullComponent  {
  @Input() message!: MessageFull;
  @Input() token = '';
  @Output() closed = new EventEmitter<void>();
}