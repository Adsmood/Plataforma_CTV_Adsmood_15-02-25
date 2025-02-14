#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Iniciando despliegue de AdsMood CTV Platform...${NC}"

# Verificar que render-cli está instalado
if ! command -v render &> /dev/null
then
    echo -e "${RED}Error: render-cli no está instalado${NC}"
    echo "Instala render-cli con: npm install -g @render/cli"
    exit 1
fi

# Verificar variables de entorno necesarias
if [ -z "$RENDER_API_KEY" ]; then
    echo -e "${RED}Error: RENDER_API_KEY no está configurada${NC}"
    exit 1
fi

# Función para desplegar un servicio
deploy_service() {
    local service_name=$1
    echo -e "${YELLOW}Desplegando $service_name...${NC}"
    
    render deploy --service $service_name
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $service_name desplegado exitosamente${NC}"
    else
        echo -e "${RED}✗ Error al desplegar $service_name${NC}"
        exit 1
    fi
}

# Desplegar base de datos primero
echo -e "${YELLOW}Verificando base de datos...${NC}"
render databases list | grep "adsmood-ctv-db" || render databases create

# Desplegar servicios en orden
deploy_service "adsmood-ctv-assets"
deploy_service "adsmood-ctv-api"
deploy_service "ctv-render-13-02"

echo -e "${GREEN}¡Despliegue completado exitosamente!${NC}"
echo -e "URLs de los servicios:"
echo -e "Frontend: ${YELLOW}https://ctv-render-13-02.onrender.com${NC}"
echo -e "Assets: ${YELLOW}https://adsmood-ctv-assets.onrender.com${NC}"
echo -e "API: ${YELLOW}https://adsmood-ctv-api.onrender.com${NC}" 