import { Injectable, NotFoundException } from '@nestjs/common';
import { GenerateVastDto, PlatformType } from './dto/generate-vast.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VastService {
  constructor(private readonly configService: ConfigService) {}

  private getVideoSpecs(platform: PlatformType) {
    const specs = {
      [PlatformType.ROKU]: {
        codec: 'H.264',
        maxRes: '1080p',
        maxBitrate: '15000000', // 15Mbps
        format: 'mp4',
      },
      [PlatformType.FIRE_TV]: {
        codec: 'H.264',
        maxRes: '2160p',
        maxBitrate: '25000000', // 25Mbps
        format: 'mp4',
      },
      [PlatformType.APPLE_TV]: {
        codec: 'H.265',
        maxRes: '2160p',
        maxBitrate: '25000000',
        format: 'mp4',
      },
      // Agregar más plataformas según sea necesario
    };

    return specs[platform] || specs[PlatformType.ROKU];
  }

  private replaceMacros(xml: string, query: GenerateVastDto): string {
    const timestamp = Date.now();
    const cacheBuster = Math.floor(Math.random() * 10000000000);

    return xml
      .replace(/\[TIMESTAMP\]/g, timestamp.toString())
      .replace(/\[CACHEBUSTING\]/g, cacheBuster.toString())
      .replace(/\[CAMPAIGN_ID\]/g, query.dv360CampaignId || '')
      .replace(/\[CREATIVE_ID\]/g, query.dv360CreativeId || '');
  }

  async generateVast(id: string, query: GenerateVastDto): Promise<string> {
    // Aquí iría la lógica para obtener la información del anuncio de la base de datos
    const adData = await this.getAdData(id);
    if (!adData) {
      throw new NotFoundException(`Anuncio con ID ${id} no encontrado`);
    }

    const specs = this.getVideoSpecs(query.platform || PlatformType.ROKU);
    const assetsUrl = this.configService.get('ASSETS_URL');
    const apiUrl = this.configService.get('API_URL');

    let vastXml = `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="4.0">
  <Ad id="[TIMESTAMP]">
    <InLine>
      <AdSystem>AdsMood CTV</AdSystem>
      <AdTitle>${adData.title}</AdTitle>
      <Description>${adData.description}</Description>
      <Impression id="[CACHEBUSTING]">
        ${apiUrl}/track/impression/${id}?platform=${query.platform || 'unknown'}
      </Impression>
      <Creatives>
        <Creative>
          <Linear>
            <Duration>${adData.duration}</Duration>
            <TrackingEvents>
              <Tracking event="start">
                ${apiUrl}/track/start/${id}
              </Tracking>
              <Tracking event="firstQuartile">
                ${apiUrl}/track/firstQuartile/${id}
              </Tracking>
              <Tracking event="midpoint">
                ${apiUrl}/track/midpoint/${id}
              </Tracking>
              <Tracking event="thirdQuartile">
                ${apiUrl}/track/thirdQuartile/${id}
              </Tracking>
              <Tracking event="complete">
                ${apiUrl}/track/complete/${id}
              </Tracking>
            </TrackingEvents>
            <MediaFiles>
              <MediaFile 
                delivery="progressive" 
                type="video/mp4" 
                width="${adData.width}" 
                height="${adData.height}"
                codec="${specs.codec}"
                bitrate="${specs.maxBitrate}"
              >
                ${assetsUrl}/videos/${adData.videoFile}
              </MediaFile>
            </MediaFiles>
            ${this.generateInteractiveSection(adData, query.platform)}
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>`;

    return this.replaceMacros(vastXml, query);
  }

  private generateInteractiveSection(adData: any, platform: PlatformType): string {
    if (!adData.interactive) return '';

    switch (platform) {
      case PlatformType.ROKU:
        return `
          <InteractiveCreative>
            <HTMLResource>
              <![CDATA[
                ${adData.interactive.rokuHtml}
              ]]>
            </HTMLResource>
          </InteractiveCreative>`;
      
      case PlatformType.FIRE_TV:
        return `
          <InteractiveCreative>
            <JavaScriptResource>
              <![CDATA[
                ${adData.interactive.fireTvJs}
              ]]>
            </JavaScriptResource>
          </InteractiveCreative>`;
      
      default:
        return '';
    }
  }

  private async getAdData(id: string): Promise<any> {
    // TODO: Implementar la obtención de datos del anuncio
    // Esta es una implementación temporal
    return {
      title: 'Demo Ad',
      description: 'Demo Interactive CTV Ad',
      duration: '00:00:30',
      width: 1920,
      height: 1080,
      videoFile: 'demo.mp4',
      interactive: {
        rokuHtml: '<div>Interactive Content</div>',
        fireTvJs: 'console.log("Interactive Content");',
      },
    };
  }

  async previewVast(id: string, query: GenerateVastDto): Promise<string> {
    return this.generateVast(id, query);
  }
} 