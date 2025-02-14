#!/bin/bash

# Configuración
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="ctv_assets_backup_${TIMESTAMP}"

# Crear directorio de backups si no existe
mkdir -p "${BACKUP_DIR}"

# Backup del código
echo "Creando backup del código..."
git archive --format=tar.gz -o "${BACKUP_DIR}/code_${BACKUP_NAME}.tar.gz" HEAD

# Backup de los assets
echo "Creando backup de los assets..."
if [ -d "data" ]; then
    tar -czf "${BACKUP_DIR}/assets_${BACKUP_NAME}.tar.gz" data/
    echo "✅ Backup de assets completado: ${BACKUP_DIR}/assets_${BACKUP_NAME}.tar.gz"
else
    echo "⚠️  El directorio 'data' no existe localmente"
fi

# Crear archivo de metadatos
echo "Creando archivo de metadatos..."
cat > "${BACKUP_DIR}/metadata_${BACKUP_NAME}.txt" << EOF
Backup CTV Assets
Fecha: $(date)
Commit: $(git rev-parse HEAD)
Branch: $(git rev-parse --abbrev-ref HEAD)
EOF

# Crear backup completo
echo "Creando archivo de backup completo..."
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
    "${BACKUP_DIR}/code_${BACKUP_NAME}.tar.gz" \
    "${BACKUP_DIR}/assets_${BACKUP_NAME}.tar.gz" \
    "${BACKUP_DIR}/metadata_${BACKUP_NAME}.txt"

# Limpiar archivos temporales
rm "${BACKUP_DIR}/code_${BACKUP_NAME}.tar.gz"
rm "${BACKUP_DIR}/assets_${BACKUP_NAME}.tar.gz"
rm "${BACKUP_DIR}/metadata_${BACKUP_NAME}.txt"

echo "✅ Backup completo creado: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" 