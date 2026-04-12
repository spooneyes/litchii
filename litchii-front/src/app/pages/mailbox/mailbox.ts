import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MailboxService, MessagePreview, MessageFull } from '../../services/mailbox.service';
import { PinStorageService } from '../../services/pin-storage.service';
import { PinDialogComponent } from '../../components/pin-dialog/pin-dialog';
import { MessageListComponent } from '../../components/message-list/message-list';
import { MessageFullComponent } from '../../components/message-full/message-full';
import { SendMessageComponent } from '../../components/send-message/send-message';

@Component({
  selector: 'app-mailbox',
  imports: [PinDialogComponent, MessageListComponent, MessageFullComponent, SendMessageComponent],
  template: `
    @if (!authenticated) {
      <app-pin-dialog (pinSubmitted)="onPinSubmit($event)" />
    } @else {
      <div class="mailbox">
        <div class="tabs">
          <button [class.active]="tab === 'messages'" (click)="tab = 'messages'">
            <span class="tab-icon">📨</span>
            <span>Messages</span>
            @if (messages.length > 0) {
              <span class="badge">{{ messages.length }}</span>
            }
          </button>
          <button [class.active]="tab === 'send'" (click)="tab = 'send'">
            <span class="tab-icon">✏️</span>
            <span>Écrire</span>
          </button>
        </div>

        @if (tab === 'messages') {
          @if (selectedMessage) {
            <app-message-full
              [message]="selectedMessage"
              [token]="token"
              (closed)="onMessageClosed()"
            />
          } @else {
            <app-message-list
              [messages]="messages"
              (messageSelected)="onMessageSelect($event)"
            />
          }
        }

        @if (tab === 'send') {
          <app-send-message
            [token]="token"
            (messageSent)="onMessageSent()"
          />
        }
      </div>
    }
  `,
  styles: `
    .mailbox {
      margin-top: 1rem;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      background: white;
      padding: 0.35rem;
      border-radius: var(--radius-pill);
      border: 1px solid var(--litchi-100);
      box-shadow: var(--shadow-sm);
    }

    .tabs button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.65rem 1rem;
      background: transparent;
      color: var(--text-secondary);
      border: none;
      border-radius: var(--radius-pill);
      cursor: pointer;
      font-family: var(--font-body);
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;

      &.active {
        background: linear-gradient(135deg, var(--litchi-500), var(--litchi-600));
        color: white;
        box-shadow: var(--shadow-sm);
      }

      &:not(.active):hover {
        background: var(--litchi-50);
      }
    }

    .tab-icon {
      font-size: 1rem;
    }

    .badge {
      background: rgba(255, 255, 255, 0.3);
      padding: 0.1rem 0.5rem;
      border-radius: var(--radius-pill);
      font-size: 0.75rem;
      font-weight: 600;
    }
  `,
})
export class MailboxComponent implements OnInit {
  @ViewChild(PinDialogComponent) pinDialog!: PinDialogComponent;

  token = '';
  authenticated = false;
  messages: MessagePreview[] = [];
  selectedMessage: MessageFull | null = null;
  tab: 'messages' | 'send' = 'messages';

  constructor(
    private route: ActivatedRoute,
    private mailboxService: MailboxService,
    private pinStorage: PinStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    if (this.pinStorage.getPin()) {
      this.authenticated = true;
      this.loadMessages();
    }
  }

  onPinSubmit(pin: string): void {
    this.pinStorage.setPin(pin);
    this.mailboxService.verifyPin(this.token).subscribe({
      next: () => {
        this.authenticated = true;
        this.loadMessages();
        this.cdr.detectChanges();
      },
      error: () => {
        this.pinStorage.clear();
        this.pinDialog.showError();
        this.cdr.detectChanges();
      },
    });
  }

  loadMessages(): void {
    this.mailboxService.getMessages(this.token).subscribe((msgs) => {
      this.messages = msgs;
      this.cdr.detectChanges();
    });
  }

  onMessageSelect(preview: MessagePreview): void {
    this.mailboxService.readMessage(this.token, preview.id).subscribe((msg) => {
      this.selectedMessage = msg;
      this.cdr.detectChanges();
    });
  }

  onMessageClosed(): void {
    this.selectedMessage = null;
    this.loadMessages();
  }

  onMessageSent(): void {
    this.tab = 'messages';
    this.loadMessages();
  }
}