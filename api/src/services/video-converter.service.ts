import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

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

@Injectable()
export class VideoConverterService {
    private readonly logger = new Logger(VideoConverterService.name);

    async convertVideo(job: ConversionJob): Promise<string> {
        const { inputPath, outputPath, format } = job;
        
        // Crear directorio de salida si no existe
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Configurar parámetros de FFmpeg según el formato
        const ffmpegArgs = this.buildFFmpegArgs(format, inputPath, outputPath);

        return new Promise((resolve, reject) => {
            const process = spawn('ffmpeg', ffmpegArgs);
            let error = '';

            process.stderr.on('data', (data) => {
                const message = data.toString();
                this.logger.debug(message);
                error += message;
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve(outputPath);
                } else {
                    reject(new Error(`FFmpeg error: ${error}`));
                }
            });
        });
    }

    private buildFFmpegArgs(format: VideoFormat, inputPath: string, outputPath: string): string[] {
        const args = [
            '-i', inputPath,
            '-y', // Sobrescribir archivo si existe
        ];

        // Configurar codec
        if (format.codec === 'h264') {
            args.push(
                '-c:v', 'libx264',
                '-preset', 'slow', // Mejor calidad a costa de tiempo de codificación
                '-profile:v', 'high',
                '-movflags', '+faststart'
            );
        } else { // h265
            args.push(
                '-c:v', 'libx265',
                '-preset', 'slow',
                '-x265-params', 'profile=main'
            );
        }

        // Configurar resolución
        switch (format.resolution) {
            case '4K':
                args.push('-vf', 'scale=3840:2160');
                break;
            case '1080p':
                args.push('-vf', 'scale=1920:1080');
                break;
            case '720p':
                args.push('-vf', 'scale=1280:720');
                break;
        }

        // Configurar bitrate
        const bitrate = format.maxBitrate * 1000; // Convertir Mbps a Kbps
        args.push('-b:v', `${bitrate}k`);

        // Configurar FPS
        args.push('-r', format.fps.toString());

        // Configurar audio
        args.push(
            '-c:a', 'aac',
            '-b:a', '192k',
            '-ar', '48000'
        );

        // Archivo de salida
        args.push(outputPath);

        return args;
    }

    async generateThumbnail(inputPath: string, outputPath: string, timeOffset: number = 0): Promise<string> {
        return new Promise((resolve, reject) => {
            const args = [
                '-i', inputPath,
                '-ss', timeOffset.toString(),
                '-vframes', '1',
                '-vf', 'scale=640:360',
                '-y',
                outputPath
            ];

            const process = spawn('ffmpeg', args);
            let error = '';

            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve(outputPath);
                } else {
                    reject(new Error(`Error generating thumbnail: ${error}`));
                }
            });
        });
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