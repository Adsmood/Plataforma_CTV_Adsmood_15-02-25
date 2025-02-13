import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Alert } from '@mui/material';

interface FileUploaderProps {
  onFileAccepted: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  title?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  error?: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileAccepted,
  accept,
  maxSize,
  title = 'Arrastra un archivo aquí o haz clic para seleccionar',
  icon,
  disabled = false,
  error = null,
}) => {
  const onDropAccepted = (files: File[]) => {
    if (files.length > 0) {
      onFileAccepted(files[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    accept,
    maxSize,
    disabled,
    multiple: false,
  });

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box
        {...getRootProps()}
        sx={{
          height: '100%',
          border: '2px dashed',
          borderColor: error ? 'error.main' : (isDragActive ? 'primary.main' : 'grey.300'),
          borderRadius: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.2s ease',
          '&:hover': disabled ? undefined : {
            bgcolor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        {icon && <Box sx={{ mb: 2, color: error ? 'error.main' : 'primary.main' }}>{icon}</Box>}
        <Typography
          variant="body1"
          align="center"
          color={error ? 'error' : 'textSecondary'}
        >
          {title}
        </Typography>
      </Box>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUploader; 