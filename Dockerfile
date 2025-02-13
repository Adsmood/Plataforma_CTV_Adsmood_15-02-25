FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear directorio para los assets
RUN mkdir -p /data

# Configurar permisos
RUN chown -R nginx:nginx /data

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"] 