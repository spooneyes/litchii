J'ai assez d'éléments pour rédiger l'audit.

Audit de sécurité — Litchii

🔴 Critique

1. PIN retourné en clair dans la réponse de création — MailboxService.java:60 & MailboxCreatedResponse.java:10
   Le PIN choisi est renvoyé tel quel. Logué/historisé côté client, il annule l'intérêt du hash BCrypt. → Supprimer pin du DTO.

2. Aucune validation du contenu / format du PIN — CreateMailboxRequest.java:11
   Seul @Size(4,6) ; aucun @Pattern("\\d{4,6}"). Un PIN « aaaa » est accepté. Pas de blacklist (0000, 1234).

3. Upload de fichier sans contrôle — LocalStorageService.java:34
- Aucune vérification du Content-Type ni du magic-number → upload de .exe, .jsp, .html (XSS stocké si servi).
- getExtension prend l'extension du nom fourni par l'utilisateur sans assainissement → ..%2F, double extension evil.php.jpg.
- Aucune limite de taille déclarée dans application.yml (spring.servlet.multipart.max-file-size).
- Pas de re-encodage de l'image (les EXIF/payloads polyglotes restent).

4. CORS trop permissif avec credentials — CorsConfig.java:22-25
   allowCredentials=true + allowedHeaders("*") + méthodes PUT/DELETE non utilisées par l'API. Si CORS_ALLOWED_ORIGINS contient un domaine wildcard ou une variante non-HTTPS, c'est exploitable.

🟠 Élevé

5. Rate-limiting contournable & fuite mémoire — RateLimitInterceptor.java:18,36
- ConcurrentHashMap jamais vidé → DoS mémoire (un attaquant qui itère sur des IPs/paths fait grossir la map indéfiniment). Utiliser un cache à expiration (Caffeine).
- request.getRemoteAddr() ignore X-Forwarded-For : derrière un reverse-proxy, toutes les requêtes partagent l'IP du proxy → un seul utilisateur bloque tout le monde, ou un attaquant change facilement d'IP source.
- Clé ip:path : un attaquant brute-force le PIN sur /verify 5x/min, mais peut aussi appeler /messages et /messages/{id} qui exécutent eux aussi verifyPin à 30 req/min. La protection anti-brute-force est contournée.

6. Pas de Spring Security — build.gradle:25
   Seul spring-security-crypto est inclus. Aucun filtre, aucune protection CSRF (mitigée par le schéma X-Pin mais non explicite), aucun header de sécurité (HSTS, X-Content-Type-Options, CSP). Actuator non sécurisé s'il est ajouté plus tard.

7. Énumération de mailbox / short code — MailboxService.java:72, MailboxController.java:62
- shortCode : 5 caractères sur 31 → ~28M combinaisons. Avec 30 req/min, un mailbox actif est trouvable en quelques jours. Pas de rate-limit dédié, pas de délai constant.
- Le endpoint resolveShortCode distingue 404 vs 200 → oracle d'énumération.

8. IDOR partiel sur les messages — MailboxService.java:99-101
   findById(messageId) puis filter ; correct, mais l'erreur générique RuntimeException("Message not found") est mappée par Spring en 500, exposant la stack et brisant le code HTTP attendu.

9. PurgeScheduler non-cluster-safe
   Si plusieurs instances tournent, plusieurs purges concurrentes ; pas de lock applicatif (ShedLock).

🟡 Moyen

10. ddl-auto: update en dev — application.yml:18 : risque de drift schéma. Préférer Flyway/Liquibase dès maintenant.

11. Mots de passe en clair dans docker-compose.yml (litchi_dev) et dans application.yml. Acceptable pour dev mais à isoler dans .env non commité.

12. BCryptPasswordEncoder instancié en new — MailboxService.java:35 au lieu d'un @Bean (force par défaut 10, OK, mais non configurable centralement).

13. Lecture image entière en mémoire + Base64 — MailboxService.java:106-107
    readAllBytes() sans contrôle de taille → DoS RAM si quelqu'un parvient à uploader un gros fichier (cf #3). Préférer le streaming et un endpoint dédié GET /messages/{id}/image.

14. MailboxCreatedResponse.link codé en dur /mailbox/... — fragile mais sans impact sécu.

15. getMessagePreviews non transactionnel — pas critique mais incohérent avec readMessage.

16. truncate sans gestion null — MailboxService.java:154 : NPE possible si content venait à être null (ici protégé par @NotBlank, mais fragile).

17. Logging du token de mailbox — PurgeScheduler.java:36 : le token (= secret d'accès) est écrit dans les logs. Si les logs fuient, les mailbox actifs restent compromis avant la purge.

18. Pas d'échappement HTML côté API — content est stocké brut. Si le frontend l'injecte via innerHTML, XSS stocké. À documenter comme contrat avec le front.

🟢 Bonnes pratiques notées

- BCrypt pour le PIN ✅
- SecureRandom pour le shortCode ✅
- @Valid sur les DTOs ✅
- Profils dev/prod séparés, secrets via env en prod ✅
- Rate-limit présent (à durcir) ✅
- TTL + purge automatique ✅

Top 5 corrections à faire en priorité

1. Retirer le PIN de MailboxCreatedResponse (#1).
2. Whitelist MIME + magic-number + limite taille + re-encodage image (#3).
3. Centraliser le rate-limit sur PIN par mailbox.id au lieu de ip:path, vider le cache (#5).
4. Ajouter Spring Security ne serait-ce que pour les headers (HSTS/CSP/X-Content-Type-Options) (#6).
5. Restreindre/auditer CORS_ALLOWED_ORIGINS en prod et durcir CorsConfig (#4).