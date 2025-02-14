import React from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Box, Typography, Alert } from '@mui/material';

interface FileUploaderProps {
  onFileAccepted: (file: File) => void;
  onError?: (error: Error) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  title?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  error?: string | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileAccepted,
  onError,
  accept,
  maxSize,
  title = 'Arrastra un archivo aquí o haz clic para seleccionar',
  icon,
  disabled = false,
  error = null,
}) => {
  const onDropAccepted = (files: File[]) => {
    if (files.length > 0) {
      try {
        const file = files[0];
        console.log('Archivo aceptado:', {
          name: file.name,
          type: file.type,
          size: file.size
        });
        onFileAccepted(file);
      } catch (error) {
        console.error('Error al procesar el archivo:', error);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDropAccepted,
    accept,
    maxSize,
    disabled,
    multiple: false,
    onDropRejected: (fileRejections: FileRejection[]) => {
      if (onError && fileRejections.length > 0) {
        onError(new Error(fileRejections[0].errors[0].message));
      }
    },
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
          {isDragReject ? 'Archivo no permitido' : title}
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