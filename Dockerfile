FROM openresty/openresty:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# Crear directorios necesarios
RUN mkdir -p /data /data/tmp

# Configurar permisos
RUN chown -R nobody:nobody /data

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar OpenResty
CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"] 