# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src/ ./src/

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración y dependencias compiladas
COPY package*.json ./
RUN npm ci --only=production

# Copiar archivos compilados
COPY --from=builder /app/dist ./dist/

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3001

# Exponer puerto
EXPOSE 3001

# Comando de inicio
CMD ["npm", "run", "start:prod"] 