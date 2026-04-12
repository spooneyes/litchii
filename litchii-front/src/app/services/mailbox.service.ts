import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MailboxCreatedResponse {
  token: string;
  shortCode: string;
  pin: string;
  link: string;
}

export interface MessagePreview {
  id: number;
  senderName: string;
  contentPreview: string;
  hasImage: boolean;
  createdAt: string;
}

export interface MessageFull {
  id: number;
  senderName: string;
  content: string;
  imageBase64: string | null;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class MailboxService {
  private apiUrl = '/api/mailboxes';

  constructor(private http: HttpClient) {}

  createMailbox(pin: string): Observable<MailboxCreatedResponse> {
    return this.http.post<MailboxCreatedResponse>(this.apiUrl, { pin });
  }

  verifyPin(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${token}/verify`, {});
  }

  getMessages(token: string): Observable<MessagePreview[]> {
    return this.http.get<MessagePreview[]>(`${this.apiUrl}/${token}/messages`);
  }

  readMessage(token: string, messageId: number): Observable<MessageFull> {
    return this.http.get<MessageFull>(`${this.apiUrl}/${token}/messages/${messageId}`);
  }

  sendMessage(token: string, senderName: string, content: string, image?: File): Observable<void> {
    const formData = new FormData();
    const message = JSON.stringify({ senderName, content });
    formData.append('message', new Blob([message], { type: 'application/json' }));

    if (image) {
      formData.append('image', image);
    }

    return this.http.post<void>(`${this.apiUrl}/${token}/messages`, formData, {
      responseType: 'text' as 'json',
    });
  }

  

  getImageUrl(token: string, messageId: number): string {
    return `${this.apiUrl}/${token}/messages/${messageId}/image`;
  }
}