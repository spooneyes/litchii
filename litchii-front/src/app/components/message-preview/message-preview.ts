import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessagePreview } from '../../services/mailbox.service';

@Component({
  selector: 'app-message-preview',
  imports: [DatePipe],
  template: `
    <div class="preview">
      <div class="avatar">{{ message.senderName.charAt(0).toUpperCase() }}</div>
      <div class="body">
        <div class="header">
          <strong>{{ message.senderName }}</strong>
          <span class="date">{{ message.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
        </div>
        <p class="excerpt">{{ message.contentPreview }}</p>
        @if (message.hasImage) {
          <span class="image-badge">📎 Image jointe</span>
        }
      </div>
    </div>
  `,
  styles: `
    .preview {
      display: flex;
      gap: 0.75rem;
      padding: 1rem;
      background: white;
      border: 1px solid var(--litchi-100);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.25s ease;

      &:hover {
        transform: translateX(4px);
        border-color: var(--litchi-300);
        box-shadow: var(--shadow-sm);
      }
    }

    .avatar {
      width: 40px;
      height: 40px;
      min-width: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--litchi-300), var(--litchi-400));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1rem;
    }

    .body {
      flex: 1;
      min-width: 0;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;

      strong {
        font-size: 0.9rem;
      }
    }

    .date {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

   .excerpt {
    color: var(--text-secondary);
    font-size: 0.85rem;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-word;
    max-width: 100%;
}

    .image-badge {
      display: inline-block;
      margin-top: 0.3rem;
      font-size: 0.75rem;
      color: var(--litchi-500);
      font-weight: 500;
    }
  `,
})
export class MessagePreviewComponent {
  @Input() message!: MessagePreview;
}
