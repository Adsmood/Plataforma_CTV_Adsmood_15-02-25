import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface FileUploaderProps {
  onFileAccepted: (file: File) => void;
  onError: (error: Error) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  title?: string;
  icon?: React.ReactNode;
  error?: string | null;
  disabled?: boolean;
}

const DropzoneBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  '&.error': {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
  },
  '&.disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
}));

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileAccepted,
  onError,
  accept,
  maxSize = 5242880, // 5MB por defecto
  title = 'Arrastra un archivo aquí o haz clic para seleccionar',
  icon,
  error,
  disabled = false,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: (files) => {
      if (files.length > 0) {
        onFileAccepted(files[0]);
      }
    },
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection) {
        const error = rejection.errors[0];
        onError(new Error(error.message));
      }
    },
    accept,
    maxSize,
    multiple: false,
    disabled,
  });

  return (
    <DropzoneBox
      {...getRootProps()}
      className={`${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
    >
      <input {...getInputProps()} />
      {icon && <Box sx={{ mb: 2 }}>{icon}</Box>}
      <Typography variant="body1" component="div">
        {isDragActive ? 'Suelta el archivo aquí' : title}
      </Typography>
      {error && (
        <Typography variant="caption" color="error">
          {error}
        </Typography>
      )}
      <Typography variant="caption" color="textSecondary">
        Tamaño máximo: {Math.round(maxSize / 1048576)}MB
      </Typography>
    </DropzoneBox>
  );
};

export default FileUploader; 