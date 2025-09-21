#!/bin/bash
PID_FILE="/root/WhisperingOrchids/dev_server.pid"
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if ps -p $PID > /dev/null; then
    kill $PID
    echo "Development server with PID $PID stopped."
  else
    echo "No running process found with PID $PID."
  fi
  rm "$PID_FILE"
else
  echo "PID file not found: $PID_FILE. Server might not be running."
fi
