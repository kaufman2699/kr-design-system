#!/bin/bash
#
# audit-tokens.sh — Compare design tokens between CSS custom properties and Tailwind config
#
# Usage: ./audit-tokens.sh [project-root]
#
# Finds the global CSS file and tailwind.config, extracts all custom properties
# and Tailwind color extensions, then reports mismatches.

set -euo pipefail

PROJECT_ROOT="${1:-.}"
CSS_FILE=""
TW_CONFIG=""

# Find global CSS file
for candidate in \
  "$PROJECT_ROOT/src/styles/globals.css" \
  "$PROJECT_ROOT/src/styles/global.css" \
  "$PROJECT_ROOT/src/app/globals.css" \
  "$PROJECT_ROOT/app/globals.css" \
  "$PROJECT_ROOT/styles/globals.css"; do
  if [[ -f "$candidate" ]]; then
    CSS_FILE="$candidate"
    break
  fi
done

# Find Tailwind config
for candidate in \
  "$PROJECT_ROOT/tailwind.config.js" \
  "$PROJECT_ROOT/tailwind.config.ts" \
  "$PROJECT_ROOT/tailwind.config.mjs" \
  "$PROJECT_ROOT/tailwind.config.cjs"; do
  if [[ -f "$candidate" ]]; then
    TW_CONFIG="$candidate"
    break
  fi
done

echo "=== Design Token Audit ==="
echo ""

if [[ -z "$CSS_FILE" ]]; then
  echo "WARNING: No global CSS file found"
else
  echo "CSS file: $CSS_FILE"
fi

if [[ -z "$TW_CONFIG" ]]; then
  echo "WARNING: No Tailwind config found"
else
  echo "TW config: $TW_CONFIG"
fi

echo ""

# Extract CSS custom properties
if [[ -n "$CSS_FILE" ]]; then
  echo "--- CSS Custom Properties (from :root) ---"
  grep -oE '\-\-[a-zA-Z0-9_-]+' "$CSS_FILE" | sort -u | while read -r prop; do
    echo "  $prop"
  done
  echo ""

  CSS_COUNT=$(grep -coE '\-\-[a-zA-Z0-9_-]+' "$CSS_FILE" 2>/dev/null | head -1 || echo "0")
  echo "Total CSS variables: ~$CSS_COUNT references"
  echo ""
fi

# Extract Tailwind color tokens
if [[ -n "$TW_CONFIG" ]]; then
  echo "--- Tailwind Color Extensions ---"
  # Look for color definitions (hex values or var() references)
  grep -E '(#[0-9a-fA-F]{3,8}|var\(--)' "$TW_CONFIG" | sed 's/^[[:space:]]*/  /' || true
  echo ""
fi

# Check for tokens in CSS but not referenced in Tailwind
if [[ -n "$CSS_FILE" && -n "$TW_CONFIG" ]]; then
  echo "--- Potential Gaps ---"

  MISSING=0
  grep -oE '\-\-[a-zA-Z0-9_-]+' "$CSS_FILE" | sort -u | while read -r prop; do
    if ! grep -q "$prop" "$TW_CONFIG" 2>/dev/null; then
      echo "  CSS-only (not in TW config): $prop"
      MISSING=$((MISSING + 1))
    fi
  done

  if [[ $MISSING -eq 0 ]]; then
    echo "  (none found — all CSS variables appear referenced in Tailwind config)"
  fi
fi

echo ""
echo "=== Audit Complete ==="
