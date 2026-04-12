#!/bin/sh
# Extract the system DNS resolver and inject it into nginx config
NAMESERVER=$(awk '/^nameserver/{print $2; exit}' /etc/resolv.conf)
export NAMESERVER="${NAMESERVER:-8.8.8.8}"

# Let nginx's envsubst process the template, then start nginx
exec /docker-entrypoint.sh nginx -g "daemon off;"
