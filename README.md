# ARCITE CCL — VPS deployment

Complete independent VPS package, using the current three-step registration experience.

## Quick deployment

Requirements: Linux VPS, Docker Engine with Compose v2, a domain/subdomain pointing to the VPS, and inbound TCP ports 80 and 443 available. Recommended: 2 CPU cores, 4 GB RAM and persistent SSD storage. The app uses Node.js 24, Next.js, SQLite and private local uploads; no Cloudflare, ChatGPT account, external database or paid payment gateway is required.

1. Extract this ZIP onto the VPS and enter the extracted directory.
2. Run `chmod +x setup.sh && ./setup.sh`.
3. Enter your domain, for example `cricket.arcite.in`. The installer creates random session and organiser credentials in `.env` and launches the app and HTTPS proxy.
4. Open `https://YOUR-DOMAIN/`. Caddy obtains HTTPS automatically once DNS resolves correctly and ports 80/443 are reachable.
5. Open `https://YOUR-DOMAIN/admin`. Username is `admin`; use `ADMIN_PASSWORD` from `.env`. Do not publish that file.

If ports 80/443 already serve another website, integrate the supplied app into your existing reverse proxy rather than starting the bundled Caddy on the same ports. The app listens on port 3000 inside Docker. No host port exposes it directly.

## Included features

- ARCITE branding, responsive landing page, animations, corporate rules, brochure and event details.
- One registration action: Register your company.
- Three steps: company/HR → 15-player squad → UPI payment, review and submit.
- ₹4,000 UPI fee, uploaded QR, number +91 75103 54425 and UPI ID msahad2001-2@okhdfcbank (recipient: Muhammed sahad).
- Required payment screenshot and UPI reference. PNG/JPG/WebP, up to 5 MB, checked on the server.
- SQLite storage of company, HR, all players, declarations, payment metadata and unique application reference.
- Private screenshot files, inaccessible as public website assets.
- Signed browser session: submitting browser can retrieve its own applications, screenshot and printable HR attestation.
- Password-protected organiser desk `/admin` with all applications, rosters, payment proofs and JSON export.
- Locked squad after submission; duplicate company/player checks and duplicate-request protection.

## Data and access

Docker volume `ccl_data` stores `registrations.sqlite` and `uploads/`. No live participant data is bundled. The database initializes automatically from `database/schema.sql` on first use. Do not delete the volume during upgrades. Keep both the database and upload files together when backing up or moving the event.

Public users need no account. Their private application access is tied to a signed, HttpOnly, secure browser cookie valid for 90 days. They should download their receipt immediately. Clearing cookies or changing devices requires organiser assistance; a public application reference is not an access password. Keep `SESSION_SECRET` unchanged during upgrades so existing browser sessions remain valid.

The organiser desk is read-only. It does not send messages or automatically approve registrations. Check actual bank credit before confirming payment, and handle eligibility/acceptance through the event coordination process. No bank verification or payment gateway is included.

## Configuration

`setup.sh` creates `.env` with domain, HTTPS origin, session secret and organiser password. Alternatively copy `.env.example` to `.env`, replace every placeholder, then run `docker compose up -d --build`.

- `PUBLIC_ORIGIN` must be the exact HTTPS website origin (no trailing slash).
- `SESSION_SECRET` must contain at least 32 random characters.
- `ADMIN_PASSWORD` must contain at least 16 characters; the setup script generates a longer password.
- `COOKIE_SECURE=true` in production. Set `false` only for isolated localhost development over HTTP.
- Payment constants: `app/payment-config.ts`; QR: `public/assets/ccl-upi-qr.png`.

## Operations

- Status: `docker compose ps`
- Logs: `docker compose logs --tail=100 app caddy`
- Rebuild after source updates: `docker compose up -d --build`
- Stop without deleting data: `docker compose down`
- Back up: `./backup.sh` (briefly pauses app writes; restarts automatically).
- Never use `docker compose down -v` when you need to retain registrations.

To restore, stop the app, replace the volume contents from a trusted backup (SQLite and uploads together), retain the original session secret, then restart. Keep backups private; they contain player contacts and payment screenshots. The privacy policy retention period requires manual data management.

## Local development and verification

Install Node.js 24, run `npm ci`, set `SESSION_SECRET`, `ADMIN_PASSWORD`, `COOKIE_SECURE=false`, then `npm run dev`. Production build: `npm run build`. Production process without Docker: `npm start` behind your own HTTPS reverse proxy, with a persistent `DATA_DIR`.

Run `node tests/integration.mjs` after building. The test uses isolated temporary storage and a local server. It checks actual database/file writes, access isolation, organiser login and restart persistence. It never transfers money or writes to the published Site. Docker deployment still requires execution on your VPS; no VPS has been accessed as part of preparing this package.
