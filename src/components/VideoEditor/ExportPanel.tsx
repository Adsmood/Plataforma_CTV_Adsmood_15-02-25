import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const PanelContainer = styled(Box)`
  padding: 16px;
  background: ${props => props.theme.colors.background.paper};
  border-radius: 8px;
`;

interface Platform {
  id: string;
  name: string;
  formats: VideoFormat[];
  presets: Preset[];
}

interface VideoFormat {
  id: string;
  name: string;
  codec: string;
  extension: string;
}

interface Preset {
  id: string;
  name: string;
  quality: string;
  bitrate: string;
  resolution: string;
}

const platforms: Platform[] = [
  {
    id: 'roku',
    name: 'Roku',
    formats: [
      { id: 'h264', name: 'H.264', codec: 'libx264', extension: 'mp4' },
      { id: 'h265', name: 'H.265 (HEVC)', codec: 'libx265', extension: 'mp4' },
    ],
    presets: [
      { id: 'hd', name: 'HD', quality: 'Alta', bitrate: '5000k', resolution: '1920x1080' },
      { id: '4k', name: '4K', quality: 'Ultra', bitrate: '15000k', resolution: '3840x2160' },
    ],
  },
  {
    id: 'firetv',
    name: 'Fire TV',
    formats: [
      { id: 'h264', name: 'H.264', codec: 'libx264', extension: 'mp4' },
      { id: 'h265', name: 'H.265 (HEVC)', codec: 'libx265', extension: 'mp4' },
    ],
    presets: [
      { id: 'hd', name: 'HD', quality: 'Alta', bitrate: '5000k', resolution: '1920x1080' },
      { id: '4k', name: '4K', quality: 'Ultra', bitrate: '15000k', resolution: '3840x2160' },
    ],
  },
  {
    id: 'appletv',
    name: 'Apple TV',
    formats: [
      { id: 'h264', name: 'H.264', codec: 'libx264', extension: 'mp4' },
      { id: 'h265', name: 'H.265 (HEVC)', codec: 'libx265', extension: 'mp4' },
    ],
    presets: [
      { id: 'hd', name: 'HD', quality: 'Alta', bitrate: '5000k', resolution: '1920x1080' },
      { id: '4k', name: '4K HDR', quality: 'Ultra', bitrate: '15000k', resolution: '3840x2160' },
    ],
  },
];

interface ExportPanelProps {
  onExport: (config: ExportConfig) => Promise<void>;
}

interface ExportConfig {
  platform: string;
  format: string;
  preset: string;
  customConfig?: {
    resolution: string;
    bitrate: string;
    quality: string;
  };
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onExport }) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [customConfig, setCustomConfig] = useState({
    resolution: '1920x1080',
    bitrate: '5000k',
    quality: 'Alta',
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        platform: selectedPlatform,
        format: selectedFormat,
        preset: selectedPreset,
        customConfig: isCustom ? customConfig : undefined,
      });
    } catch (error) {
      console.error('Error al exportar:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <PanelContainer>
      <Typography variant="h6" gutterBottom>
        Exportar Video
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <FormControl fullWidth>
          <InputLabel>Plataforma</InputLabel>
          <Select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            label="Plataforma"
          >
            {platforms.map((platform) => (
              <MenuItem key={platform.id} value={platform.id}>
                {platform.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedPlatformData && (
          <>
            <FormControl fullWidth>
              <InputLabel>Formato</InputLabel>
              <Select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                label="Formato"
              >
                {selectedPlatformData.formats.map((format) => (
                  <MenuItem key={format.id} value={format.id}>
                    {format.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Preset</InputLabel>
              <Select
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                label="Preset"
              >
                <MenuItem value="custom">Configuración Personalizada</MenuItem>
                {selectedPlatformData.presets.map((preset) => (
                  <MenuItem key={preset.id} value={preset.id}>
                    {preset.name} ({preset.resolution})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        {selectedPreset === 'custom' && (
          <Accordion expanded={isCustom} onChange={() => setIsCustom(!isCustom)}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Configuración Personalizada</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label="Resolución"
                  value={customConfig.resolution}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, resolution: e.target.value })
                  }
                  helperText="Ejemplo: 1920x1080"
                />
                <TextField
                  label="Bitrate"
                  value={customConfig.bitrate}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, bitrate: e.target.value })
                  }
                  helperText="Ejemplo: 5000k"
                />
                <TextField
                  label="Calidad"
                  value={customConfig.quality}
                  onChange={(e) =>
                    setCustomConfig({ ...customConfig, quality: e.target.value })
                  }
                  helperText="Alta, Media, Baja"
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleExport}
          disabled={!selectedPlatform || !selectedFormat || !selectedPreset || isExporting}
          startIcon={isExporting ? <CircularProgress size={20} /> : null}
        >
          {isExporting ? 'Exportando...' : 'Exportar'}
        </Button>
      </Box>
    </PanelContainer>
  );
};

export default ExportPanel; 