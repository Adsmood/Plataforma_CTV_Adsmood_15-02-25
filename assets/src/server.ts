import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',');
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB límite
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'video/mp4',
            'video/quicktime',
            'image/jpeg',
            'image/png',
            'image/gif'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido'));
        }
    }
});

// Rutas
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
    }
    
    const fileUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
    res.json({
        message: 'Archivo subido exitosamente',
        file: {
            originalName: req.file.originalname,
            filename: req.file.filename,
            size: req.file.size,
            url: fileUrl
        }
    });
});

// Servir archivos estáticos
app.use('/files', express.static(path.join(__dirname, '../uploads')));

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: err.message || 'Error interno del servidor'
    });
});

app.listen(port, () => {
    console.log(`Servidor de assets ejecutándose en el puerto ${port}`);
}); 