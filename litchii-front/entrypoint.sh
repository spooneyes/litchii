#!/bin/sh
# Extract the system DNS resolver and inject it into nginx config
RAW_NS=$(awk '/^nameserver/{print $2; exit}' /etc/resolv.conf)
# Nginx requires IPv6 addresses in brackets: [fd12::10]
case "$RAW_NS" in
  *:*) NAMESERVER="[$RAW_NS]" ;;
  *)   NAMESERVER="$RAW_NS" ;;
esac
export NAMESERVER="${NAMESERVER:-8.8.8.8}"

# Let nginx's envsubst process the template, then start nginx
exec /docker-entrypoint.sh nginx -g "daemon off;"
