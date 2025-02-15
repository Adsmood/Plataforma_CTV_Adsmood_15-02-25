import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { StorageService } from './storage.service';

interface VideoFormat {
    codec: 'h264' | 'h265';
    resolution: '720p' | '1080p' | '4K';
    fps: 30 | 60;
    maxBitrate: number;
}

interface ConversionJob {
    inputPath: string;
    outputPath: string;
    format: VideoFormat;
}

interface ConversionConfig {
  codec: string;
  resolution: string;
  bitrate: string;
  quality: string;
}

@Injectable()
export class VideoConverterService {
    private readonly logger = new Logger(VideoConverterService.name);
    private ffmpeg: FFmpeg;

    constructor(private readonly storageService: StorageService) {
        this.ffmpeg = new FFmpeg();
        this.init();
    }

    private async init() {
        await this.ffmpeg.load();
    }

    async convertVideo(
        inputUrl: string,
        outputFileName: string,
        config: ConversionConfig,
    ): Promise<string> {
        try {
            // Descargar el video de entrada
            const inputData = await fetchFile(inputUrl);
            const inputFileName = 'input.mp4';
            await this.ffmpeg.writeFile(inputFileName, inputData);

            // Preparar los argumentos de FFmpeg
            const args = [
                '-i', inputFileName,
                '-c:v', config.codec,
                '-b:v', config.bitrate,
                '-vf', `scale=${config.resolution.replace('x', ':')}`,
                '-preset', 'slow', // mejor calidad a costa de tiempo de codificación
                '-profile:v', 'high',
                '-movflags', '+faststart', // optimizar para streaming
            ];

            // Agregar argumentos específicos según el codec
            if (config.codec === 'libx265') {
                args.push('-x265-params', 'crf=23'); // balance entre calidad y tamaño
                args.push('-tag:v', 'hvc1'); // compatibilidad con Apple
            } else {
                args.push('-crf', '23'); // para h264
            }

            args.push(outputFileName);

            // Ejecutar la conversión
            await this.ffmpeg.exec(args);

            // Leer el archivo convertido
            const outputData = await this.ffmpeg.readFile(outputFileName);

            // Subir al servicio de almacenamiento
            const outputUrl = await this.storageService.uploadVideo(
                outputFileName,
                outputData as Buffer,
            );

            // Limpiar archivos temporales
            await this.ffmpeg.deleteFile(inputFileName);
            await this.ffmpeg.deleteFile(outputFileName);

            return outputUrl;
        } catch (error) {
            console.error('Error en la conversión:', error);
            throw new Error(`Error al convertir el video: ${error.message}`);
        }
    }

    async generateThumbnail(
        inputUrl: string,
        time: number = 0,
    ): Promise<string> {
        try {
            const inputData = await fetchFile(inputUrl);
            const inputFileName = 'input.mp4';
            const outputFileName = 'thumbnail.jpg';

            await this.ffmpeg.writeFile(inputFileName, inputData);

            await this.ffmpeg.exec([
                '-i', inputFileName,
                '-ss', time.toString(),
                '-vframes', '1',
                '-vf', 'scale=640:-1',
                outputFileName,
            ]);

            const thumbnailData = await this.ffmpeg.readFile(outputFileName);
            const thumbnailUrl = await this.storageService.uploadImage(
                outputFileName,
                thumbnailData as Buffer,
            );

            await this.ffmpeg.deleteFile(inputFileName);
            await this.ffmpeg.deleteFile(outputFileName);

            return thumbnailUrl;
        } catch (error) {
            console.error('Error al generar thumbnail:', error);
            throw new Error(`Error al generar thumbnail: ${error.message}`);
        }
    }

    getCodecFromFormat(format: string): string {
        switch (format) {
            case 'h264':
                return 'libx264';
            case 'h265':
                return 'libx265';
            default:
                return 'libx264';
        }
    }

    getResolutionFromPreset(preset: string): string {
        switch (preset) {
            case 'hd':
                return '1920x1080';
            case '4k':
                return '3840x2160';
            default:
                return '1920x1080';
        }
    }

    getBitrateFromPreset(preset: string): string {
        switch (preset) {
            case 'hd':
                return '5000k';
            case '4k':
                return '15000k';
            default:
                return '5000k';
        }
    }

    async getVideoMetadata(inputPath: string): Promise<{
        duration: number;
        width: number;
        height: number;
        fps: number;
        bitrate: number;
        codec: string;
    }> {
        return new Promise((resolve, reject) => {
            const args = [
                '-i', inputPath,
                '-v', 'quiet',
                '-print_format', 'json',
                '-show_format',
                '-show_streams'
            ];

            const process = spawn('ffprobe', args);
            let output = '';
            let error = '';

            process.stdout.on('data', (data) => {
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    try {
                        const metadata = JSON.parse(output);
                        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
                        
                        resolve({
                            duration: parseFloat(metadata.format.duration),
                            width: videoStream.width,
                            height: videoStream.height,
                            fps: eval(videoStream.r_frame_rate), // Convertir "30/1" a número
                            bitrate: parseInt(metadata.format.bit_rate) / 1000, // Convertir a Kbps
                            codec: videoStream.codec_name
                        });
                    } catch (e) {
                        reject(new Error(`Error parsing metadata: ${e.message}`));
                    }
                } else {
                    reject(new Error(`FFprobe error: ${error}`));
                }
            });
        });
    }
} 