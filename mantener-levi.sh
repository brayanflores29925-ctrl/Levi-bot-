#!/data/data/com.termux/files/usr/bin/bash

cd ~/Levi-bot

termux-wake-lock

while true; do
    echo "🚀 Iniciando Levi Bots..."
    node index.js

    echo "⚠️ Levi Bots se detuvo. Reiniciando en 5 segundos..."
    sleep 5
done
