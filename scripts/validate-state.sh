#!/bin/bash
set -e
if [ ! -f "STATE.md" ]; then
  echo "❌ STATE.md not found"
  exit 1
fi
echo "✅ STATE.md valid"
