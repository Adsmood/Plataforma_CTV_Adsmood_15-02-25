FROM openresty/openresty:alpine

# Instalar lua-resty-upload
RUN apk add --no-cache git make \
    && cd /tmp \
    && git clone https://github.com/openresty/lua-resty-upload.git \
    && cd lua-resty-upload \
    && make install \
    && cd / \
    && rm -rf /tmp/lua-resty-upload \
    && apk del git make

# Copiar configuración personalizada de Nginx
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# Crear directorios necesarios y establecer permisos
RUN mkdir -p /data /data/tmp /usr/local/openresty/nginx/logs \
    && chown -R nobody:nobody /data /usr/local/openresty/nginx/logs \
    && chmod 755 /data \
    && chmod 700 /data/tmp

# Configurar usuario nobody
USER nobody

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar OpenResty
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"] 