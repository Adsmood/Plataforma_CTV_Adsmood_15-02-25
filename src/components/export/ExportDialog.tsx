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
} from '@mui/material';
import { Platform, ExportConfig, PLATFORM_CONFIGS } from '../../types/export';
import { exportVideo } from '../../services/exportService';
import useProjectStore from '../../stores/projectStore';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ open, onClose }) => {
  const [platform, setPlatform] = useState<Platform>('roku');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  
  const currentProject = useProjectStore((state: any) => state.currentProject);

  const handleExport = async () => {
    if (!currentProject) {
      setError('No hay un proyecto activo para exportar');
      return;
    }

    setIsExporting(true);
    setError(null);
    setExportUrl(null);

    try {
      // Obtener la configuración específica de la plataforma
      const platformConfig = PLATFORM_CONFIGS[platform];
      
      const result = await exportVideo(
        currentProject.name,
        platform,
        platformConfig
      );

      if (result.success) {
        setExportUrl(result.url);
      } else {
        setError(result.error || 'Error desconocido durante la exportación');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setIsExporting(false);
    }
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
          
          {exportUrl && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Video exportado exitosamente
            </Alert>
          )}

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Plataforma</InputLabel>
            <Select
              value={platform}
              label="Plataforma"
              onChange={(e) => setPlatform(e.target.value as Platform)}
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

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configuración para {platform.replace('_', ' ').toUpperCase()}:
            <br />
            Resolución: {PLATFORM_CONFIGS[platform].resolution}
            <br />
            FPS: {PLATFORM_CONFIGS[platform].fps}
            <br />
            Codec: {PLATFORM_CONFIGS[platform].videoCodec?.toUpperCase()}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isExporting}>
          Cancelar
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          disabled={isExporting || !currentProject}
          startIcon={isExporting ? <CircularProgress size={20} /> : null}
        >
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 