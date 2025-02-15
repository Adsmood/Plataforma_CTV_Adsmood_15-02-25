# Usar una imagen base de Node.js con Alpine Linux
FROM node:18-alpine

# Instalar FFmpeg y otras dependencias necesarias
RUN apk add --no-cache ffmpeg

# Crear directorio de la aplicación
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Crear directorio para uploads
RUN mkdir -p uploads/conversions

# Compilar la aplicación
RUN npm run build

# Exponer el puerto
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"] 