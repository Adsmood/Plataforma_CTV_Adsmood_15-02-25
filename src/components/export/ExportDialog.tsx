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
import { generateVastXml, downloadVastXml } from '../../services/vastExporter';
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

      // Generar y descargar VAST si está habilitado
      if (generateVast) {
        const vastOptions = {
          baseUrl: window.location.origin,
          impressionUrl: `${window.location.origin}/track/impression`,
          clickTrackingUrl: `${window.location.origin}/track/click`,
          startTrackingUrl: `${window.location.origin}/track/start`,
          completeTrackingUrl: `${window.location.origin}/track/complete`,
          skipTrackingUrl: `${window.location.origin}/track/skip`,
          interactionTrackingUrl: `${window.location.origin}/track/interaction`,
          viewableImpressionUrl: `${window.location.origin}/track/viewable`,
          quartileTrackingUrls: {
            firstQuartile: `${window.location.origin}/track/firstQuartile`,
            midpoint: `${window.location.origin}/track/midpoint`,
            thirdQuartile: `${window.location.origin}/track/thirdQuartile`,
          },
          videoFormats: [],
          fallbackVideoUrl: '',
        };

        // Si solo se exportó para una plataforma, generar VAST específico
        if (selectedPlatforms.length === 1) {
          const platform = selectedPlatforms[0];
          const vastXml = generateVastXml(editorState, vastOptions, exportedUrls);
          downloadVastXml(vastXml, currentProject.name, platform);
        } else {
          // Generar VAST con todos los formatos
          const vastXml = generateVastXml(editorState, vastOptions, exportedUrls);
          downloadVastXml(vastXml, currentProject.name);
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