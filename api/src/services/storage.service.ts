import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StorageService {
    private readonly logger = new Logger(StorageService.name);
    private readonly assetsUrl: string;
    private readonly uploadsPath: string;

    constructor() {
        this.assetsUrl = process.env.ASSETS_URL || 'https://adsmood-ctv-assets.onrender.com';
        this.uploadsPath = path.join(process.cwd(), 'uploads');
        
        // Asegurar que el directorio de uploads existe
        if (!fs.existsSync(this.uploadsPath)) {
            fs.mkdirSync(this.uploadsPath, { recursive: true });
        }
    }

    async saveFile(
        buffer: Buffer,
        filename: string,
        subdirectory: string = 'conversions'
    ): Promise<string> {
        try {
            const dirPath = path.join(this.uploadsPath, subdirectory);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }

            const filePath = path.join(dirPath, filename);
            await fs.promises.writeFile(filePath, buffer);

            // Construir URL pública
            const publicPath = path.join(subdirectory, filename).replace(/\\/g, '/');
            return `${this.assetsUrl}/${publicPath}`;
        } catch (error) {
            this.logger.error(`Error saving file ${filename}:`, error);
            throw error;
        }
    }

    async deleteFile(filename: string, subdirectory: string = 'conversions'): Promise<void> {
        try {
            const filePath = path.join(this.uploadsPath, subdirectory, filename);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        } catch (error) {
            this.logger.error(`Error deleting file ${filename}:`, error);
            throw error;
        }
    }

    async cleanOldFiles(
        subdirectory: string = 'conversions',
        maxAgeHours: number = 24
    ): Promise<void> {
        try {
            const dirPath = path.join(this.uploadsPath, subdirectory);
            if (!fs.existsSync(dirPath)) return;

            const files = await fs.promises.readdir(dirPath);
            const now = Date.now();
            const maxAge = maxAgeHours * 60 * 60 * 1000;

            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stats = await fs.promises.stat(filePath);
                
                if (now - stats.mtimeMs > maxAge) {
                    await fs.promises.unlink(filePath);
                    this.logger.debug(`Deleted old file: ${file}`);
                }
            }
        } catch (error) {
            this.logger.error(`Error cleaning old files:`, error);
            throw error;
        }
    }

    getPublicUrl(filename: string, subdirectory: string = 'conversions'): string {
        const publicPath = path.join(subdirectory, filename).replace(/\\/g, '/');
        return `${this.assetsUrl}/${publicPath}`;
    }
} 