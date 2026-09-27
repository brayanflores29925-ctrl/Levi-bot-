#!/data/data/com.termux/files/usr/bin/bash

BOT_DIR="$HOME/Levi-bot"
LOG="$BOT_DIR/watchdog.log"

while true; do
    FECHA=$(date '+%Y-%m-%d %H:%M:%S')

    if pgrep -f "[n]ode.*index.js" >/dev/null; then
        echo "[$FECHA] 🟢 Levi Bot activo." >> "$LOG"
    else
        echo "[$FECHA] 🔴 Levi Bot caído. Iniciando..." >> "$LOG"

        if command -v pm2 >/dev/null 2>&1; then
            pm2 restart levi-bot >/dev/null 2>&1 || pm2 start "$BOT_DIR/index.js" --name levi-bot >/dev/null 2>&1
        else
            nohup node "$BOT_DIR/index.js" >> "$BOT_DIR/levi-watchdog.log" 2>&1 &
        fi

        sleep 10
    fi

    sleep 30
done
