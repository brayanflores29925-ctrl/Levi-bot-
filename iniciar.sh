#!/data/data/com.termux/files/usr/bin/bash

read -s -p "🔐 PIN de LeviBots: " PIN
echo

if [ "$PIN" != "kerin" ]; then
  echo "❌ PIN incorrecto"
  exit 1
fi

echo "✅ PIN correcto. Iniciando LeviBots..."
node index.js
