import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { Platform, ExportConfig, PLATFORM_CONFIGS } from '../../types/export';
import { exportVideo } from '../../services/exportService';
import { generateVastXml, validateVastXml } from '../../services/vastExporter';
import useProjectStore from '../../stores/projectStore';
import { useEditorStore } from '../../stores/editorStore';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['roku']);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportedVideos, setExportedVideos] = useState<{ [key: string]: string }>({});
  const [generateVast, setGenerateVast] = useState(true);
  const [vastXml, setVastXml] = useState<string | null>(null);
  
  const currentProject = useProjectStore((state) => state.currentProject);
  const editorState = useEditorStore();

  const handleExport = async () => {
    if (!currentProject) {
      setError('No hay un proyecto activo para exportar');
      return;
    }

    setIsExporting(true);
    setError(null);
    setExportedVideos({});
    setVastXml(null);

    try {
      const exportedUrls: { [key: string]: string } = {};

      // Exportar videos para cada plataforma seleccionada
      for (const platform of selectedPlatforms) {
        const platformConfig = PLATFORM_CONFIGS[platform];
        
        const result = await exportVideo(
          currentProject.name,
          platform,
          platformConfig
        );

        if (result.success) {
          exportedUrls[platform] = result.url;
        }
      }

      setExportedVideos(exportedUrls);

      // Generar VAST si está habilitado
      if (generateVast) {
        const vastOptions = {
          baseUrl: import.meta.env.VITE_API_URL || 'https://adsmood-ctv-api.onrender.com',
          impressionUrl: `${import.meta.env.VITE_API_URL}/track/impression`,
          clickTrackingUrl: `${import.meta.env.VITE_API_URL}/track/click`,
          startTrackingUrl: `${import.meta.env.VITE_API_URL}/track/start`,
          completeTrackingUrl: `${import.meta.env.VITE_API_URL}/track/complete`,
          skipTrackingUrl: `${import.meta.env.VITE_API_URL}/track/skip`,
          interactionTrackingUrl: `${import.meta.env.VITE_API_URL}/track/interaction`,
          viewableImpressionUrl: `${import.meta.env.VITE_API_URL}/track/viewable`,
          quartileTrackingUrls: {
            firstQuartile: `${import.meta.env.VITE_API_URL}/track/firstQuartile`,
            midpoint: `${import.meta.env.VITE_API_URL}/track/midpoint`,
            thirdQuartile: `${import.meta.env.VITE_API_URL}/track/thirdQuartile`,
          },
          videoFormats: [],
          fallbackVideoUrl: exportedUrls[selectedPlatforms[0]] || '',
        };

        // Si solo se exportó para una plataforma, generar VAST específico
        if (selectedPlatforms.length === 1) {
          const platform = selectedPlatforms[0];
          const xml = generateVastXml(editorState, vastOptions, { [platform]: exportedUrls[platform] });
          const validation = validateVastXml(xml);
          
          if (!validation.isValid) {
            console.error('Errores en el VAST XML:', validation.errors);
            throw new Error('Error al generar el VAST XML: ' + validation.errors.join(', '));
          }
          
          setVastXml(xml);
        } else {
          // Generar VAST con todos los formatos
          const xml = generateVastXml(editorState, vastOptions, exportedUrls);
          const validation = validateVastXml(xml);
          
          if (!validation.isValid) {
            console.error('Errores en el VAST XML:', validation.errors);
            throw new Error('Error al generar el VAST XML: ' + validation.errors.join(', '));
          }
          
          setVastXml(xml);
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePlatformChange = (event: any) => {
    const value = event.target.value as Platform[];
    setSelectedPlatforms(value);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Exportar Video</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {Object.keys(exportedVideos).length > 0 && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Videos exportados exitosamente
              {vastXml && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  VAST XML generado correctamente. Usa la siguiente URL en DV360:
                  <br />
                  <code>{`${import.meta.env.VITE_API_URL}/vast/${currentProject?.id}`}</code>
                </Typography>
              )}
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Plataformas</InputLabel>
            <Select
              multiple
              value={selectedPlatforms}
              label="Plataformas"
              onChange={handlePlatformChange}
              disabled={isExporting}
            >
              <MenuItem value="roku">Roku</MenuItem>
              <MenuItem value="fire_tv">Amazon Fire TV</MenuItem>
              <MenuItem value="apple_tv">Apple TV</MenuItem>
              <MenuItem value="android_tv">Android TV</MenuItem>
              <MenuItem value="samsung_tv">Samsung TV</MenuItem>
              <MenuItem value="lg_tv">LG TV</MenuItem>
              <MenuItem value="vizio">Vizio</MenuItem>
              <MenuItem value="hulu">Hulu</MenuItem>
              <MenuItem value="youtube_tv">YouTube TV</MenuItem>
              <MenuItem value="pluto_tv">Pluto TV</MenuItem>
              <MenuItem value="peacock">Peacock</MenuItem>
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={generateVast}
                onChange={(e) => setGenerateVast(e.target.checked)}
                disabled={isExporting}
              />
            }
            label="Generar VAST"
          />

          <Stack spacing={1} sx={{ mt: 2 }}>
            {selectedPlatforms.map(platform => (
              <Typography key={platform} variant="body2" color="text.secondary">
                {platform.replace('_', ' ').toUpperCase()}:
                <br />
                Resolución: {PLATFORM_CONFIGS[platform].resolution}
                <br />
                FPS: {PLATFORM_CONFIGS[platform].fps}
                <br />
                Codec: {PLATFORM_CONFIGS[platform].videoCodec?.toUpperCase()}
                {exportedVideos[platform] && (
                  <>
                    <br />
                    URL: {exportedVideos[platform]}
                  </>
                )}
              </Typography>
            ))}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isExporting}>
          Cancelar
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={isExporting || !currentProject || selectedPlatforms.length === 0}
          startIcon={isExporting ? <CircularProgress size={20} /> : null}
        >
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 