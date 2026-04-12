import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { MailboxCreateComponent } from './pages/mailbox-create/mailbox-create';
import { MailboxComponent } from './pages/mailbox/mailbox';
import { ShortCodeRedirectComponent } from './pages/short-code-redirect/short-code-redirect';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: MailboxCreateComponent },
  { path: 'mailbox/:token', component: MailboxComponent },
  { path: 'm/:shortCode', component: ShortCodeRedirectComponent },
];