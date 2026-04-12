import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
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
      justify-content: center;
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
export class HomeComponent {}