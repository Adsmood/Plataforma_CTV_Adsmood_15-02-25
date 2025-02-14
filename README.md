# CTV Platform

Plataforma de CTV para la gestión y entrega de anuncios interactivos.

## Requisitos

- Node.js v18.19.0
- PostgreSQL
- Docker (para el servicio de assets)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Adsmood/CTV_Render_13_02.git
cd CTV_Render_13_02
```

2. Instalar dependencias:
```bash
npm run install:all
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
cp api/.env.example api/.env
```

4. Generar el cliente Prisma y ejecutar migraciones:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## Desarrollo

1. Iniciar la API:
```bash
npm run start:api
```

2. Iniciar el Frontend:
```bash
npm run start:frontend
```

3. Iniciar el servicio de Assets:
```bash
npm run docker:build
npm run docker:start
```

## Estructura del Proyecto

```
├── api/                # Backend NestJS
│   ├── src/           # Código fuente
│   ├── prisma/        # Schema y migraciones
│   └── test/          # Tests
├── frontend/          # Frontend React/Vite
└── assets/           # Servicio de assets (OpenResty)
```

## Scripts Disponibles

- `npm run start:api` - Inicia la API en modo desarrollo
- `npm run start:frontend` - Inicia el frontend en modo desarrollo
- `npm run build:api` - Construye la API
- `npm run build:frontend` - Construye el frontend
- `npm run prisma:generate` - Genera el cliente Prisma
- `npm run prisma:migrate` - Ejecuta las migraciones
- `npm run prisma:studio` - Abre Prisma Studio
- `npm run docker:build` - Construye la imagen Docker de assets
- `npm run docker:start` - Inicia el contenedor de assets

## Endpoints Principales

### Interactive Module
- `POST /interactive/:adId/interactions` - Crear interacción
- `GET /interactive/:adId/interactions` - Obtener interacciones
- `PUT /interactive/interactions/:id` - Actualizar interacción
- `DELETE /interactive/interactions/:id` - Eliminar interacción

### Tracking Module
- `POST /track/:type/:adId` - Registrar evento
- `GET /track/metrics/:adId` - Obtener métricas
- `GET /track/events/:adId` - Obtener eventos

## Contribución

1. Crear rama: `git checkout -b feature/nombre-feature`
2. Commit cambios: `git commit -m 'feat: descripción'`
3. Push a la rama: `git push origin feature/nombre-feature`
4. Crear Pull Request 