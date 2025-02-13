#!/bin/bash

# Crear directorio data si no existe
mkdir -p data

# Descargar los assets usando curl
echo "🔄 Descargando assets del servidor..."
echo "Por favor, ve a Render.com > adsmood-ctv-assets > Shell"
echo "Ejecuta los siguientes comandos en la shell de Render:"
echo ""
echo "cd /data"
echo "tar -czf /tmp/assets.tar.gz *"
echo "cat /tmp/assets.tar.gz | base64"
echo ""
echo "Copia la salida y pégala en un archivo llamado 'assets_base64.txt'"
echo "Luego ejecuta: ./download_assets.sh assets_base64.txt"

if [ -z "$1" ]; then
    exit 0
fi

INPUT_FILE="$1"
if [ ! -f "$INPUT_FILE" ]; then
    echo "❌ Error: Archivo $INPUT_FILE no encontrado"
    exit 1
fi

# Decodificar y extraer
cat "$INPUT_FILE" | base64 -d > data/assets.tar.gz
cd data && tar -xzf assets.tar.gz && rm assets.tar.gz

echo "✅ Assets descargados y extraídos en el directorio data/" 