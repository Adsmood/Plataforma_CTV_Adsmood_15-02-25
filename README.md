# CTV Platform Frontend

Este es el frontend de la plataforma CTV que permite la creación y gestión de anuncios interactivos para Connected TV.

## Configuración del Entorno

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```
3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ASSETS_URL=https://adsmood-ctv-assets.onrender.com
```

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm start
```

## Integración con el Backend

El frontend se integra con dos servicios principales:

1. API Principal (`REACT_APP_API_URL`):
   - Gestión de interacciones
   - Gestión de overlays
   - Generación de VAST

2. Servicio de Assets (`REACT_APP_ASSETS_URL`):
   - Subida de imágenes y videos
   - Almacenamiento de recursos multimedia

### Endpoints Principales

#### Interacciones

- `POST /interactive/:adId/interactions` - Crear interacción
- `PUT /interactive/:adId/interactions/:id` - Actualizar interacción
- `DELETE /interactive/:adId/interactions/:id` - Eliminar interacción
- `GET /interactive/:adId/interactions` - Obtener interacciones

#### Overlays

- `POST /interactive/:adId/overlays` - Crear overlay
- `PUT /interactive/:adId/overlays/:id` - Actualizar overlay
- `DELETE /interactive/:adId/overlays/:id` - Eliminar overlay
- `GET /interactive/:adId/overlays` - Obtener overlays

#### Assets

- `POST /upload` - Subir archivo multimedia

#### VAST

- `GET /interactive/:adId/vast` - Generar VAST

## Estructura del Proyecto

```
src/
  ├── components/         # Componentes reutilizables
  │   └── common/        # Componentes comunes (FileUploader, etc.)
  ├── modules/           # Módulos principales
  │   └── interactive/   # Módulo de interactividad
  ├── services/          # Servicios
  │   └── apiService.ts  # Servicio de API
  └── stores/            # Estado global
      └── editorStore.ts # Estado del editor
```

## Contribución

1. Crea una rama para tu feature: `git checkout -b feature/nombre-feature`
2. Haz commit de tus cambios: `git commit -m 'feat: descripción del cambio'`
3. Haz push a la rama: `git push origin feature/nombre-feature`
4. Crea un Pull Request 