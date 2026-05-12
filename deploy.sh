#!/usr/bin/env bash
# istoc.com — GitHub Pages deploy
# Kullanım: bu klasörde Terminal aç → ./deploy.sh
set -euo pipefail

REPO_URL="https://github.com/karacaismail/istocpazar.git"
BRANCH="main"

echo "→ Git init"
git init -q

echo "→ Dosyaları ekle"
git add .

echo "→ İlk commit"
git -c user.email="karacai@yandex.com" \
    -c user.name="ismail karaca" \
    commit -q -m "İstoç stratejik panel — ilk yayın

- Pazar boyutlandırma (TAM/SAM/SOM): \$200M / \$15M / \$7.2M tavan
- 20 ay aylık SOM hedefi (May 2026 → Ara 2027) · 3 senaryo
- 15 detay sayfası: pazarlama, finans, GTM, eylem, operasyon
- Mobile-first design system (Roboto, ECharts, Flowbite, Phosphor)
- Tüm üye/MRR/milestone değerleri TAM/SAM/SOM master ile senkron"

echo "→ Branch: $BRANCH"
git branch -M "$BRANCH"

echo "→ Remote ekle: $REPO_URL"
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

echo "→ Push (kimlik doğrulama isteyebilir)"
git push -u origin "$BRANCH"

cat <<EOF

================================================================
Push tamam.

GitHub Pages aktivasyon (tek sefer):
  1. https://github.com/karacaismail/istocpazar/settings/pages
  2. Source: "Deploy from a branch"
  3. Branch: main / (root)
  4. Save

~60 saniye sonra yayında:
  https://karacaismail.github.io/istocpazar/

Sonraki güncellemelerde:
  git add . && git commit -m "..." && git push
================================================================
EOF
