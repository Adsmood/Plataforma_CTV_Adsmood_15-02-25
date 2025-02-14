import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VastService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async generateVast(id: string, platform?: string): Promise<string> {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: { mediaFiles: true },
    });

    if (!ad) {
      throw new NotFoundException(`Ad with ID ${id} not found`);
    }

    const apiUrl = this.config.get('API_URL');
    const assetsUrl = this.config.get('ASSETS_URL');

    return `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="4.2" xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <Ad id="${ad.id}">
    <InLine>
      <AdSystem version="1.0">Adsmood CTV Platform</AdSystem>
      <AdTitle><![CDATA[${ad.title}]]></AdTitle>
      <Description><![CDATA[${ad.description || ''}]]></Description>
      
      <Impression><![CDATA[${apiUrl}/track/impression/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Impression>
      
      <Creatives>
        <Creative id="${ad.id}_video" sequence="1">
          <Linear>
            <Duration>${this.formatDuration(ad.duration)}</Duration>
            <TrackingEvents>
              <Tracking event="start"><![CDATA[${apiUrl}/track/start/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Tracking>
              <Tracking event="firstQuartile"><![CDATA[${apiUrl}/track/firstQuartile/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Tracking>
              <Tracking event="midpoint"><![CDATA[${apiUrl}/track/midpoint/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Tracking>
              <Tracking event="thirdQuartile"><![CDATA[${apiUrl}/track/thirdQuartile/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Tracking>
              <Tracking event="complete"><![CDATA[${apiUrl}/track/complete/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Tracking>
              <Tracking event="mute"><![CDATA[${apiUrl}/track/mute/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Tracking>
              <Tracking event="unmute"><![CDATA[${apiUrl}/track/unmute/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Tracking>
              <Tracking event="pause"><![CDATA[${apiUrl}/track/pause/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Tracking>
              <Tracking event="resume"><![CDATA[${apiUrl}/track/resume/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Tracking>
            </TrackingEvents>
            
            <VideoClicks>
              <ClickThrough><![CDATA[${apiUrl}/click/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></ClickThrough>
              <ClickTracking><![CDATA[${apiUrl}/track/click/${ad.id}?cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></ClickTracking>
            </VideoClicks>
            
            <MediaFiles>
              ${ad.mediaFiles
                .filter(file => !platform || file.platform === platform)
                .map(file => `
                <MediaFile 
                  id="${file.id}"
                  delivery="progressive" 
                  type="video/mp4" 
                  width="${file.width}" 
                  height="${file.height}" 
                  bitrate="${file.bitrate}"
                  codec="${file.codec}"
                  maintainAspectRatio="true">
                  <![CDATA[${assetsUrl}/${file.filename}]]>
                </MediaFile>
              `).join('')}
            </MediaFiles>
            
            ${ad.interactiveData ? `
            <InteractiveCreativeFile>
              <![CDATA[${apiUrl}/interactive/${ad.id}/overlay.html]]>
            </InteractiveCreativeFile>
            ` : ''}
          </Linear>
        </Creative>
      </Creatives>
      
      <Extensions>
        <Extension type="AdVerification">
          <VerificationParameters>
            <![CDATA[${JSON.stringify({
              adId: ad.id,
              timestamp: '[TIMESTAMP]',
              cacheBuster: '[CACHEBUSTING]',
              trackingUrls: {
                impression: `${apiUrl}/track/impression/${ad.id}`,
                complete: `${apiUrl}/track/complete/${ad.id}`,
                click: `${apiUrl}/track/click/${ad.id}`,
              }
            })}]]>
          </VerificationParameters>
        </Extension>
      </Extensions>
    </InLine>
  </Ad>
</VAST>`;
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
} 