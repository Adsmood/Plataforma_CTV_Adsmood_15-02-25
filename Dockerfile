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

# Crear todos los directorios necesarios como root
RUN mkdir -p /data \
    && mkdir -p /data/tmp \
    && mkdir -p /usr/local/openresty/nginx/logs \
    && mkdir -p /usr/local/openresty/nginx/proxy_temp \
    && mkdir -p /usr/local/openresty/nginx/client_body_temp \
    && mkdir -p /usr/local/openresty/nginx/fastcgi_temp \
    && mkdir -p /usr/local/openresty/nginx/scgi_temp \
    && mkdir -p /usr/local/openresty/nginx/uwsgi_temp \
    && chmod 755 /data \
    && chmod 700 /data/tmp \
    && chmod 700 /usr/local/openresty/nginx/proxy_temp \
    && chmod 700 /usr/local/openresty/nginx/client_body_temp \
    && chmod 700 /usr/local/openresty/nginx/fastcgi_temp \
    && chmod 700 /usr/local/openresty/nginx/scgi_temp \
    && chmod 700 /usr/local/openresty/nginx/uwsgi_temp \
    && chown -R nobody:nobody /data \
    && chown -R nobody:nobody /usr/local/openresty/nginx

# Configurar usuario nobody
USER nobody

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar OpenResty
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"] 