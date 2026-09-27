#!/data/data/com.termux/files/usr/bin/bash

cd ~/Levi-bot
termux-wake-lock

while true; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🚀 Iniciando Levi Bots..."

    node index.js

    CODIGO=$?

    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ⚠️ Levi Bots terminó. Código: $CODIGO"
    echo "🔄 Reiniciando en 5 segundos..."

    sleep 5
done
