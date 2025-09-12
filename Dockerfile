# Imagen estable y ligera
FROM node:22.19-alpine3.22

LABEL maintainer="Carlos Yerena <carlos@mangos77.mx>"

ARG PORT
ARG ALLOW_HOSTS
ARG DEBUG_LEVEL

# (Opcional) defaults de entorno en la imagen; se pueden sobreescribir en runtime con -e VARIABLE="VALOR"
ENV PORT="${PORT:-8181}" \
    ALLOW_HOSTS="${ALLOW_HOSTS:-m77print.local}" \
    DEBUG_LEVEL="${DEBUG_LEVEL:-0}"

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY package.json ./package.json
COPY .env.production ./.env.production
COPY src ./src

# Instala dependencias (usa package.json y package-lock.json)
RUN npm install --production

# Se necesita dotenv-cli, hay que instalarlo
RUN npm install dotenv-cli


# --- SHIMS PARA USAR BINARIOS DEL HOST ---
# 1) sudo-shim: todo "sudo <cmd>" se ejecuta en el host
RUN printf '#!/bin/sh\nexec chroot /host "$@"\n' > /usr/local/bin/sudo \
 && chmod +x /usr/local/bin/sudo

# 2) hostwrap genérico: ejecuta en el host el binario con el MISMO path ($0)
RUN printf '#!/bin/sh\nexec chroot /host "$0" "$@"\n' > /usr/local/bin/hostwrap \
 && chmod +x /usr/local/bin/hostwrap

# 3) Symlinks para comandos SIN sudo que deben ir al host
#    (añade aquí los que necesites)
RUN ln -sf /usr/local/bin/hostwrap /usr/sbin/iw && \
    ln -sf /usr/local/bin/hostwrap /usr/bin/nmcli



# Expone el puerto 80 (metadato).
EXPOSE ${PORT:-8181}

# Comando por defecto para iniciar la aplicación
CMD ["npm", "run", "start"]

# Healthcheck simple (opcional)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:${PORT:-8181}/ >/dev/null 2>&1 || exit 1
