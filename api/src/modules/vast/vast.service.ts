import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateVastDto, PlatformType } from './dto/generate-vast.dto';
import { VastGeneratorService } from './services/vast-generator.service';
import { CreativeService } from './services/creative.service';
import { Creative } from './entities/creative.entity';

interface VideoFormat {
    codec: string;
    resolution: string;
    fps: number;
    bitrate: number;
    width: number;
    height: number;
}

interface AdData {
    id: string;
    title: string;
    description: string;
    duration: number;
    width: number;
    height: number;
    videoVariants: {
        platform: string;
        url: string;
        format: VideoFormat;
    }[];
    interactive?: {
        overlayUrl?: string;
        clickThroughUrl: string;
        customParams?: Record<string, string>;
    };
}

@Injectable()
export class VastService {
    constructor(
        private readonly configService: ConfigService,
        private readonly vastGenerator: VastGeneratorService,
        private readonly creativeService: CreativeService
    ) {}

    async generateVast(id: string, query: GenerateVastDto): Promise<string> {
        const creative = await this.creativeService.getCreative(Number(id));
        if (!creative) {
            throw new NotFoundException(`Creative with ID ${id} not found`);
        }

        const platform = query.platform || PlatformType.ROKU;
        
        // Validar el creativo para la plataforma
        const validation = await this.creativeService.validateCreativeForPlatform(Number(id), platform);
        if (!validation.isValid) {
            throw new Error(`Creative validation failed: ${validation.errors.join(', ')}`);
        }

        const apiUrl = this.configService.get('API_URL');
        const trackingEndpoints = {
            impression: `${apiUrl}/track/impression/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
            error: `${apiUrl}/track/error/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]&error=[ERRORCODE]`,
            click: `${apiUrl}/track/click/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
            events: {
                start: `${apiUrl}/track/start/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                firstQuartile: `${apiUrl}/track/firstQuartile/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                midpoint: `${apiUrl}/track/midpoint/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                thirdQuartile: `${apiUrl}/track/thirdQuartile/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                complete: `${apiUrl}/track/complete/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                mute: `${apiUrl}/track/mute/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                unmute: `${apiUrl}/track/unmute/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                pause: `${apiUrl}/track/pause/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                resume: `${apiUrl}/track/resume/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                skip: `${apiUrl}/track/skip/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]`,
                progress: `${apiUrl}/track/progress/${id}?platform=${platform}&ts=[TIMESTAMP]&cb=[CACHEBUSTING]&progress=[CONTENTPLAYHEAD]`
            }
        };

        const vastXml = this.vastGenerator.generateVastXml(
            this.mapCreativeToAdData(creative),
            platform,
            trackingEndpoints,
            {
                enableVerification: query.enableThirdPartyVerification,
                dv360CampaignId: creative.dv360?.campaignId || query.dv360CampaignId,
                dv360CreativeId: creative.dv360?.creativeId || query.dv360CreativeId
            }
        );

        const xmlValidation = this.vastGenerator.validateVastXml(vastXml);
        if (!xmlValidation.isValid) {
            throw new Error(`VAST XML inválido: ${xmlValidation.errors.join(', ')}`);
        }

        return vastXml;
    }

    async previewVast(id: string, query: GenerateVastDto): Promise<string> {
        return this.generateVast(id, query);
    }

    private mapCreativeToAdData(creative: Creative): any {
        return {
            id: creative.id,
            title: creative.title,
            description: creative.description,
            duration: creative.duration,
            width: creative.width,
            height: creative.height,
            videoVariants: creative.videoVariants.map(variant => ({
                platform: variant.platform,
                url: variant.url,
                format: variant.format
            })),
            interactive: creative.interactive
        };
    }
} 