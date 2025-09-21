# Build image:
# docker build --no-cache -t api_net .

# Start container (remove --rm flag to prevent delete container when stop them)
# docker run --rm  --name m77_api_net -e PORT=8081 -e ALLOW_HOSTS="m77dev.local" -e DEBUG_LEVEL=0 --network host -v /:/host -v /run:/run -v /etc/machine-id:/etc/machine-id:ro api_net


FROM node:22.19-alpine3.22

LABEL maintainer="Carlos Yerena <carlos@mangos77.mx>"

ARG PORT
ARG ALLOW_HOSTS
ARG DEBUG_LEVEL

# Set ENV values
ENV PORT="${PORT:-8181}" \
    ALLOW_HOSTS="${ALLOW_HOSTS:-m77print.local}" \
    DEBUG_LEVEL="${DEBUG_LEVEL:-0}"

# Set work directory
WORKDIR /app

# Copy files
COPY package.json ./package.json
COPY .env.production ./.env.production
COPY src ./src

# Install dependencies
RUN npm install --production

# dotenv-cli is required
RUN npm install dotenv-cli


# --- SHIMS TO USE HOST BINARIES ---
RUN printf '#!/bin/sh\nexec chroot /host "$@"\n' > /usr/local/bin/sudo \
 && chmod +x /usr/local/bin/sudo

RUN printf '#!/bin/sh\nexec chroot /host "$0" "$@"\n' > /usr/local/bin/hostwrap \
 && chmod +x /usr/local/bin/hostwrap

RUN ln -sf /usr/local/bin/hostwrap /usr/sbin/iw && \
    ln -sf /usr/local/bin/hostwrap /usr/bin/nmcli



EXPOSE ${PORT:-8181}

# Command to start
CMD ["npm", "run", "start"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:${PORT:-8181}/api/ >/dev/null 2>&1 || exit 1
