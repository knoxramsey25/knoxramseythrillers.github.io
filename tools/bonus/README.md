# Restricted Annex (Bonus Page) — Encryption Guide

This repo uses client-side encryption to gate the bonus page for engaged readers. We use `staticrypt` to encrypt `fieldguide/bonus.html` with a code (e.g., from the printed book). The result is a self-contained HTML file that prompts for the code and decrypts in-browser.

> Prereq: You already installed staticrypt globally.
>
> Verified from terminal context: `npm install -g staticrypt` returned exit code 0.

## Files

- Source (unlocked): `fieldguide/bonus.html`
- Access landing (public, no password): `fieldguide/bonus_locked.html`
- Encrypted output (committed): `fieldguide/bonus.html` (we overwrite it with the encrypted version)

## One-time setup

- Ensure the page is not indexed:
  - `bonus.html` and `bonus_locked.html` both include `<meta name="robots" content="noindex, nofollow">`.
- Ensure the sidebar does not link the page (keep it discoverable by direct URL or CTA only).

## Encrypt the page

Replace `GENEVA204` with your chosen access code.

```zsh
# From repo root
staticrypt fieldguide/bonus.html "GENEVA204" \
  --output fieldguide/bonus.html \
  --salt "$(LC_ALL=C tr -dc A-Za-z0-9 </dev/urandom | head -c 32)" \
  --short \
  --title "Restricted Annex — Access Gate" \
  --description "Authorized readers only. Enter your access code to unlock." \
  --remember 72 \
  --passphrase-placeholder "Enter access code from the book"
```

Flags explained:
- `--short`: Minimal template (fits the site look better).
- `--remember 72`: Remember code for 72h in localStorage.
- `--salt`: Unique salt; rotate if you re-encrypt.

## Verify locally

Open the encrypted file directly in a browser and ensure the prompt appears. Enter your code and verify content renders.

```zsh
open fieldguide/bonus.html
```

## Publish

Commit and push the updated `fieldguide/bonus.html` (encrypted) and any asset changes.

```zsh
git add fieldguide/bonus.html fieldguide/bonus_locked.html tools/bonus/README.md
git commit -m "feat(bonus): add Restricted Annex and encryption guide; gated with Staticrypt"
git push origin main
```

## Updating the code later

- Edit the unlocked source at `fieldguide/bonus.html` in a separate branch or temporary filename (e.g., `bonus.source.html`).
- Re-run the `staticrypt` command above to overwrite the live `bonus.html` with a freshly encrypted version.

## Notes

- Client-side gating is about fan experience, not absolute security. Don’t put truly sensitive material behind Staticrypt.
- Use the `bonus_locked.html` page as your public CTA from newsletters, inside the book, and on `/darkrecipe/`.
