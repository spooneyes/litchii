import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-short-code-redirect',
  template: `
    <div class="loading">
      <span>🪷</span>
      <p>Redirection...</p>
    </div>
  `,
  styles: `
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding-top: 6rem;

      span {
        font-size: 3rem;
        animation: pulse 1.5s ease-in-out infinite;
      }

      p {
        color: var(--text-muted);
        font-size: 0.95rem;
      }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.15); opacity: 0.7; }
    }
  `,
})
export class ShortCodeRedirectComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const shortCode = this.route.snapshot.paramMap.get('shortCode')!;
    this.http
      .get<{ token: string }>(`/api/mailboxes/short/${shortCode}`)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/mailbox', res.token], { replaceUrl: true });
        },
        error: () => {
          this.router.navigate(['/'], { replaceUrl: true });
        },
      });
  }
}