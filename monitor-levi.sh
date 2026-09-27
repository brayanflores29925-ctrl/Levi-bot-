#!/data/data/com.termux/files/usr/bin/bash

BOT_DIR="$HOME/Levi-bot"
LOG="$BOT_DIR/monitor.log"
SUPERVISOR="$BOT_DIR/supervisor-levi.sh"

while true; do
    FECHA=$(date '+%Y-%m-%d %H:%M:%S')

    if pgrep -f "[n]ode.*index.js" >/dev/null; then
        echo "[$FECHA] 🟢 Levi Bot activo." >> "$LOG"
    else
        echo "[$FECHA] 🔴 Levi Bot no está ejecutándose." >> "$LOG"

        if pgrep -f "[s]upervisor-levi.sh" >/dev/null; then
            echo "[$FECHA] 🛡️ Supervisor activo; esperando recuperación..." >> "$LOG"
        else
            echo "[$FECHA] 🚨 Supervisor caído. Reiniciándolo..." >> "$LOG"
            nohup "$SUPERVISOR" >> "$BOT_DIR/supervisor.log" 2>&1 &
            sleep 3
        fi
    fi

    sleep 30
done
