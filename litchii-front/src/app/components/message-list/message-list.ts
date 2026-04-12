import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessagePreview } from '../../services/mailbox.service';
import { MessagePreviewComponent } from '../message-preview/message-preview';

@Component({
  selector: 'app-message-list',
  imports: [MessagePreviewComponent],
  template: `
    @if (messages.length === 0) {
      <div class="empty">
        <span class="empty-icon">📭</span>
        <p>Aucun message pour le moment</p>
        <p class="empty-hint">Les messages apparaîtront ici</p>
      </div>
    } @else {
      <div class="list">
        @for (msg of messages; track msg.id) {
          <app-message-preview
            [message]="msg"
            (click)="messageSelected.emit(msg)"
          />
        }
      </div>
    }
  `,
  styles: `
    .empty {
      text-align: center;
      padding: 4rem 1rem;

      .empty-icon {
        font-size: 3rem;
        display: block;
        margin-bottom: 1rem;
      }

      p {
        color: var(--text-secondary);
        font-size: 1rem;
      }

      .empty-hint {
        color: var(--text-muted);
        font-size: 0.85rem;
        margin-top: 0.3rem;
      }
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
  `,
})
export class MessageListComponent {
  @Input() messages: MessagePreview[] = [];
  @Output() messageSelected = new EventEmitter<MessagePreview>();
}