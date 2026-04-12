import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="home">
      <div class="hero">
        <span class="hero-emoji">🪷</span>
        <h1>Boîte aux lettres<br><em>éphémère</em></h1>
        <p class="subtitle">
          Envoyez des messages qui disparaissent après lecture.
          Comme un secret murmuré, une fois entendu, il s'évapore.
        </p>
      </div>

      <div class="actions">
        <a routerLink="/create" class="btn-primary">
          <span>Créer une boîte</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>

        <div class="separator">
          <span class="line"></span>
          <span class="or">ou</span>
          <span class="line"></span>
        </div>

        <div class="code-input">
          <input
            type="text"
            [(ngModel)]="code"
            placeholder="Entrez un code"
            maxlength="10"
            (keyup.enter)="goToMailbox()"
          />
          <button (click)="goToMailbox()" [disabled]="!code.trim()">Accéder</button>
        </div>
      </div>

      <div class="features">
        <div class="feature">
          <span class="feature-icon">✉️</span>
          <h3>Texte & Images</h3>
          <p>Partagez messages et photos en toute simplicité</p>
        </div>
        <div class="feature">
          <span class="feature-icon">👁️</span>
          <h3>Lu = Supprimé</h3>
          <p>Les messages disparaissent après consultation</p>
        </div>
        <div class="feature">
          <span class="feature-icon">🔒</span>
          <h3>Protégé par PIN</h3>
          <p>Seuls ceux qui connaissent le code peuvent lire</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .home {
      padding-top: 3rem;
    }

    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }

    .hero-emoji {
      font-size: 4rem;
      display: block;
      margin-bottom: 1.5rem;
      animation: bounce 3s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    h1 {
      font-family: var(--font-display);
      font-size: 2.8rem;
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: var(--text-primary);

      em {
        color: var(--litchi-500);
        font-style: italic;
      }
    }

    .subtitle {
      margin-top: 1.2rem;
      font-size: 1.05rem;
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.2rem;
      margin-bottom: 4rem;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.9rem 2rem;
      background: linear-gradient(135deg, var(--litchi-500), var(--litchi-600));
      color: white;
      border: none;
      border-radius: var(--radius-pill);
      text-decoration: none;
      font-family: var(--font-body);
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      box-shadow: var(--shadow-md), 0 0 0 0 rgba(224, 77, 111, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg), 0 0 0 6px rgba(224, 77, 111, 0.12);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .separator {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      max-width: 320px;

      .line {
        flex: 1;
        height: 1px;
        background: var(--litchi-200);
      }

      .or {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 500;
      }
    }

    .code-input {
      display: flex;
      gap: 0.5rem;
      width: 100%;
      max-width: 320px;

      input {
        flex: 1;
        padding: 0.7rem 1rem;
        border: 2px solid var(--litchi-200);
        border-radius: var(--radius-md);
        background: white;
        font-size: 1rem;
        font-family: var(--font-body);
        color: var(--text-primary);
        text-align: center;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        outline: none;
        transition: border-color 0.3s;

        &:focus {
          border-color: var(--litchi-400);
        }

        &::placeholder {
          text-transform: none;
          letter-spacing: normal;
          color: var(--text-muted);
        }
      }

      button {
        padding: 0.7rem 1.2rem;
        background: var(--litchi-50);
        color: var(--litchi-600);
        border: 2px solid var(--litchi-200);
        border-radius: var(--radius-md);
        cursor: pointer;
        font-family: var(--font-body);
        font-size: 0.9rem;
        font-weight: 600;
        transition: all 0.3s;
        white-space: nowrap;

        &:hover:not(:disabled) {
          background: var(--litchi-100);
          border-color: var(--litchi-400);
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
    }

    .features {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.2rem;
    }

    .feature {
      background: white;
      padding: 1.5rem 1.2rem;
      border-radius: var(--radius-md);
      text-align: center;
      border: 1px solid var(--litchi-100);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: var(--shadow-md);
        border-color: var(--litchi-200);
      }
    }

    .feature-icon {
      font-size: 1.6rem;
      display: block;
      margin-bottom: 0.75rem;
    }

    .feature h3 {
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
    }

    .feature p {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    @media (max-width: 500px) {
      h1 { font-size: 2rem; }
      .features { grid-template-columns: 1fr; }
    }
  `,
})
export class HomeComponent {
  code = '';

  constructor(private router: Router) {}

  goToMailbox(): void {
    const trimmed = this.code.trim().toUpperCase();
    if (trimmed) {
      this.router.navigate(['/m/', trimmed]);
    }
  }
}