import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Creative } from '../entities/creative.entity';
import { VideoVariant } from '../entities/video-variant.entity';
import { CTV_PLATFORMS } from '../../../types/platforms';

interface CreateCreativeDto {
    campaignId: string;
    advertiserId: string;
    title: string;
    description: string;
    duration: number;
    width: number;
    height: number;
    interactive?: {
        overlayUrl?: string;
        clickThroughUrl: string;
        customParams?: Record<string, string>;
    };
    dv360?: {
        campaignId?: string;
        creativeId?: string;
    };
}

interface AddVideoVariantDto {
    platform: string;
    url: string;
    format: {
        codec: string;
        resolution: string;
        fps: number;
        bitrate: number;
        width: number;
        height: number;
    };
}

@Injectable()
export class CreativeService {
    constructor(
        @InjectRepository(Creative)
        private readonly creativeRepository: Repository<Creative>,
        @InjectRepository(VideoVariant)
        private readonly variantRepository: Repository<VideoVariant>
    ) {}

    async createCreative(data: CreateCreativeDto): Promise<Creative> {
        const creative = this.creativeRepository.create(data);
        return await this.creativeRepository.save(creative);
    }

    async addVideoVariant(creativeId: number, data: AddVideoVariantDto): Promise<VideoVariant> {
        const creative = await this.creativeRepository.findOne({ where: { id: creativeId } });
        if (!creative) {
            throw new NotFoundException(`Creative with ID ${creativeId} not found`);
        }

        // Validar que la plataforma existe
        if (!CTV_PLATFORMS[data.platform]) {
            throw new Error(`Platform ${data.platform} not supported`);
        }

        // Validar el formato de video contra las especificaciones de la plataforma
        const platformSpec = CTV_PLATFORMS[data.platform];
        const formatValid = platformSpec.videoFormats.some(format => 
            format.codec === data.format.codec &&
            format.resolution === data.format.resolution &&
            format.fps === data.format.fps &&
            format.maxBitrate >= data.format.bitrate
        );

        if (!formatValid) {
            throw new Error(`Video format not supported for platform ${data.platform}`);
        }

        const variant = this.variantRepository.create({
            ...data,
            creativeId
        });

        return await this.variantRepository.save(variant);
    }

    async getCreative(id: number): Promise<Creative> {
        const creative = await this.creativeRepository.findOne({
            where: { id },
            relations: ['videoVariants']
        });

        if (!creative) {
            throw new NotFoundException(`Creative with ID ${id} not found`);
        }

        return creative;
    }

    async updateCreative(id: number, data: Partial<CreateCreativeDto>): Promise<Creative> {
        const creative = await this.getCreative(id);
        Object.assign(creative, data);
        return await this.creativeRepository.save(creative);
    }

    async deleteCreative(id: number): Promise<void> {
        const creative = await this.getCreative(id);
        await this.creativeRepository.remove(creative);
    }

    async getCreativesForCampaign(campaignId: string): Promise<Creative[]> {
        return await this.creativeRepository.find({
            where: { campaignId },
            relations: ['videoVariants']
        });
    }

    async validateCreativeForPlatform(id: number, platform: string): Promise<{ 
        isValid: boolean;
        errors: string[];
    }> {
        const creative = await this.getCreative(id);
        const platformSpec = CTV_PLATFORMS[platform];
        const errors: string[] = [];

        if (!platformSpec) {
            errors.push(`Platform ${platform} not supported`);
            return { isValid: false, errors };
        }

        // Validar duración
        if (creative.duration > platformSpec.maxDuration) {
            errors.push(`Duration exceeds platform maximum of ${platformSpec.maxDuration} seconds`);
        }

        // Validar interactividad
        if (creative.interactive && !platformSpec.interactivitySupport) {
            errors.push('Platform does not support interactivity');
        }

        // Validar variantes de video
        const platformVariants = creative.videoVariants.filter(v => v.platform === platform);
        if (platformVariants.length === 0) {
            errors.push('No video variants available for this platform');
        } else {
            platformVariants.forEach(variant => {
                const formatValid = platformSpec.videoFormats.some(format => 
                    format.codec === variant.format.codec &&
                    format.resolution === variant.format.resolution &&
                    format.fps === variant.format.fps &&
                    format.maxBitrate >= variant.format.bitrate
                );

                if (!formatValid) {
                    errors.push(`Video format not supported: ${variant.format.codec} ${variant.format.resolution} ${variant.format.fps}fps ${variant.format.bitrate}Mbps`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
} 