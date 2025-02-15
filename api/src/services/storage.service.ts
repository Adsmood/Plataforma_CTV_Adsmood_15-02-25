import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class StorageService {
    private readonly uploadDir: string;
    private readonly assetsBaseUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.uploadDir = this.configService.get<string>('UPLOAD_DIR', './uploads');
        this.assetsBaseUrl = this.configService.get<string>('ASSETS_URL', 'http://localhost:3000');
        this.initStorage();
    }

    private async initStorage() {
        try {
            await fs.mkdir(this.uploadDir, { recursive: true });
            await fs.mkdir(path.join(this.uploadDir, 'videos'), { recursive: true });
            await fs.mkdir(path.join(this.uploadDir, 'images'), { recursive: true });
        } catch (error) {
            console.error('Error al inicializar el almacenamiento:', error);
        }
    }

    async uploadVideo(filename: string, data: Buffer): Promise<string> {
        const videoPath = path.join(this.uploadDir, 'videos', filename);
        await fs.writeFile(videoPath, data);
        return `${this.assetsBaseUrl}/videos/${filename}`;
    }

    async uploadImage(filename: string, data: Buffer): Promise<string> {
        const imagePath = path.join(this.uploadDir, 'images', filename);
        await fs.writeFile(imagePath, data);
        return `${this.assetsBaseUrl}/images/${filename}`;
    }

    async deleteFile(filepath: string): Promise<void> {
        try {
            await fs.unlink(filepath);
        } catch (error) {
            console.error('Error al eliminar archivo:', error);
        }
    }

    async getFileUrl(filename: string, type: 'video' | 'image'): Promise<string> {
        const subdir = type === 'video' ? 'videos' : 'images';
        return `${this.assetsBaseUrl}/${subdir}/${filename}`;
    }

    async fileExists(filename: string, type: 'video' | 'image'): Promise<boolean> {
        const subdir = type === 'video' ? 'videos' : 'images';
        const filepath = path.join(this.uploadDir, subdir, filename);
        try {
            await fs.access(filepath);
            return true;
        } catch {
            return false;
        }
    }
} 