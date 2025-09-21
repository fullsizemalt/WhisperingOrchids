#!/bin/bash
cd /root/WhisperingOrchids
npm run dev > /dev/null 2>&1 &
echo $! > /root/WhisperingOrchids/dev_server.pid
echo "Development server started with PID $(cat /root/WhisperingOrchids/dev_server.pid)"
