#!/bin/bash

# Verificar si se proporcionó un archivo de backup
if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar un archivo de backup"
    echo "Uso: ./restore.sh <archivo_backup>"
    exit 1
fi

BACKUP_FILE="$1"
RESTORE_DIR="restore_$(date +%Y%m%d_%H%M%S)"

# Verificar si el archivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: El archivo de backup no existe: $BACKUP_FILE"
    exit 1
fi

# Crear directorio temporal para la restauración
echo "Creando directorio temporal..."
mkdir -p "$RESTORE_DIR"

# Extraer el backup principal
echo "Extrayendo backup principal..."
tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"

# Extraer los componentes individuales
cd "$RESTORE_DIR"

# Mostrar metadatos
echo "📋 Metadatos del backup:"
cat metadata_*.txt
echo "------------------------"

# Restaurar código
echo "Restaurando código..."
mkdir -p code
tar -xzf code_*.tar.gz -C code/

# Restaurar assets
echo "Restaurando assets..."
mkdir -p assets
tar -xzf assets_*.tar.gz -C assets/

echo "✅ Backup restaurado en: $RESTORE_DIR"
echo "  - Código: $RESTORE_DIR/code"
echo "  - Assets: $RESTORE_DIR/assets" 