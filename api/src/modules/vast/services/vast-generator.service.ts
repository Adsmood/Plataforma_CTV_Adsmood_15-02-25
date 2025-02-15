import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateVastDto, PlatformType } from '../dto/generate-vast.dto';
import { CTV_PLATFORMS } from '../../../types/platforms';

interface VpaidConfig {
    scriptUrl: string;
    parameters: Record<string, any>;
}

interface InteractiveConfig {
    type: 'vpaid' | 'html5';
    framework?: string;
    overlayUrl?: string;
    resources: {
        type: string;
        url: string;
        id: string;
    }[];
    actions: {
        type: string;
        label: string;
        url?: string;
        data?: Record<string, any>;
    }[];
}

@Injectable()
export class VastGeneratorService {
    private readonly logger = new Logger(VastGeneratorService.name);

    constructor(private readonly configService: ConfigService) {}

    generateVastXml(
        adData: any,
        platform: PlatformType,
        trackingEndpoints: {
            impression: string;
            error: string;
            events: Record<string, string>;
            click: string;
            interactionEvents?: Record<string, string>;
        },
        options: {
            enableVerification?: boolean;
            dv360CampaignId?: string;
            dv360CreativeId?: string;
            samId?: string;
        } = {}
    ): string {
        try {
            const platformSpec = CTV_PLATFORMS[platform];
            const timestamp = Date.now();
            const cacheBuster = Math.floor(Math.random() * 10000000000);

            // Configurar interactividad según la plataforma
            const interactiveConfig = this.getInteractiveConfig(adData, platform);

            const vast = `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="${platformSpec.vastVersion}" xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <Ad id="${adData.id}_${timestamp}" sequence="1">
        <InLine>
            <AdSystem version="2.0">AdsMood CTV</AdSystem>
            <AdTitle><![CDATA[${adData.title}]]></AdTitle>
            <Description><![CDATA[${adData.description}]]></Description>
            <Error><![CDATA[${this.replaceMacros(trackingEndpoints.error, { timestamp, cacheBuster })}]]></Error>
            <Impression id="imp-${cacheBuster}">
                <![CDATA[${this.replaceMacros(trackingEndpoints.impression, { timestamp, cacheBuster })}]]>
            </Impression>
            ${this.generateVerificationSection(options)}
            <Creatives>
                <Creative id="${adData.id}_creative" sequence="1">
                    <Linear skipoffset="${platformSpec?.skipOffset || '00:00:05'}">
                        <Duration>${this.formatDuration(adData.duration)}</Duration>
                        <TrackingEvents>
                            ${this.generateTrackingEvents(trackingEndpoints.events, { timestamp, cacheBuster })}
                            ${this.generateInteractionTrackingEvents(trackingEndpoints.interactionEvents, { timestamp, cacheBuster })}
                        </TrackingEvents>
                        <VideoClicks>
                            <ClickThrough>
                                <![CDATA[${this.replaceMacros(trackingEndpoints.click, { timestamp, cacheBuster })}]]>
                            </ClickThrough>
                        </VideoClicks>
                        <MediaFiles>
                            ${this.generateMediaFiles(adData, platform)}
                            ${this.generateVpaidMediaFile(interactiveConfig, platform)}
                        </MediaFiles>
                        ${this.generateInteractiveResources(interactiveConfig, platform)}
                    </Linear>
                </Creative>
                ${this.generateCompanionAds(adData, platform)}
            </Creatives>
            <Extensions>
                ${this.generatePlatformExtensions(platform, options)}
                ${this.generateInteractiveExtensions(interactiveConfig, platform)}
                <Extension type="AdsMood">
                    <Platform>${platform}</Platform>
                    <CreativeFormat>Interactive</CreativeFormat>
                    <TrackingVersion>2.0</TrackingVersion>
                </Extension>
            </Extensions>
        </InLine>
    </Ad>
</VAST>`;

            return vast;
        } catch (error) {
            this.logger.error(`Error generando VAST XML: ${error.message}`);
            throw error;
        }
    }

    private getInteractiveConfig(adData: any, platform: string): InteractiveConfig | null {
        if (!adData.interactive || !CTV_PLATFORMS[platform]?.interactivitySupport) {
            return null;
        }

        switch (platform) {
            case 'roku':
                return {
                    type: 'vpaid',
                    framework: 'RAF',
                    resources: this.mapInteractiveResources(adData.interactive),
                    actions: this.mapInteractiveActions(adData.interactive, platform)
                };
            case 'fireTV':
                return {
                    type: 'vpaid',
                    framework: 'FireTV-SDK',
                    resources: this.mapInteractiveResources(adData.interactive),
                    actions: this.mapInteractiveActions(adData.interactive, platform)
                };
            case 'androidTV':
            case 'samsungTV':
                return {
                    type: 'html5',
                    overlayUrl: adData.interactive.overlayUrl,
                    resources: this.mapInteractiveResources(adData.interactive),
                    actions: this.mapInteractiveActions(adData.interactive, platform)
                };
            default:
                return null;
        }
    }

    private mapInteractiveResources(interactive: any): { type: string; url: string; id: string; }[] {
        const resources = [];
        
        if (interactive.background) {
            resources.push({
                type: 'image',
                url: interactive.background.url,
                id: 'background'
            });
        }

        if (interactive.gallery) {
            interactive.gallery.images.forEach((image, index) => {
                resources.push({
                    type: 'image',
                    url: image.url,
                    id: `gallery_${index}`
                });
            });
        }

        if (interactive.carousel) {
            interactive.carousel.items.forEach((item, index) => {
                resources.push({
                    type: 'image',
                    url: item.imageUrl,
                    id: `carousel_${index}`
                });
            });
        }

        return resources;
    }

    private mapInteractiveActions(interactive: any, platform: string): { type: string; label: string; url?: string; data?: any; }[] {
        const actions = [];

        if (interactive.buttons) {
            interactive.buttons.forEach((button, index) => {
                actions.push({
                    type: 'button',
                    label: button.label,
                    url: button.url,
                    data: {
                        position: button.position,
                        style: button.style
                    }
                });
            });
        }

        if (interactive.carousel) {
            actions.push({
                type: 'carousel',
                label: 'Browse Products',
                data: {
                    items: interactive.carousel.items.map(item => ({
                        title: item.title,
                        description: item.description,
                        price: item.price,
                        actionUrl: item.url
                    }))
                }
            });
        }

        return actions;
    }

    private generateVpaidMediaFile(config: InteractiveConfig | null, platform: string): string {
        if (!config || config.type !== 'vpaid') return '';

        const vpaidScript = this.getVpaidScriptUrl(platform);
        return `
            <MediaFile 
                delivery="progressive" 
                type="application/javascript"
                apiFramework="VPAID"
                width="${config.resources[0]?.data?.width || 1920}"
                height="${config.resources[0]?.data?.height || 1080}">
                <![CDATA[${vpaidScript}]]>
            </MediaFile>`;
    }

    private getVpaidScriptUrl(platform: string): string {
        const baseUrl = this.configService.get('ASSETS_URL');
        switch (platform) {
            case 'roku':
                return `${baseUrl}/vpaid/roku-raf.js`;
            case 'fireTV':
                return `${baseUrl}/vpaid/firetv-sdk.js`;
            default:
                return `${baseUrl}/vpaid/default.js`;
        }
    }

    private generateInteractiveResources(config: InteractiveConfig | null, platform: string): string {
        if (!config) return '';

        return `
            <InteractiveCreativeFile>
                <![CDATA[
                    ${JSON.stringify({
                        version: "1.0",
                        type: config.type,
                        framework: config.framework,
                        overlayUrl: config.overlayUrl,
                        resources: config.resources,
                        actions: config.actions
                    })}
                ]]>
            </InteractiveCreativeFile>`;
    }

    private generateCompanionAds(adData: any, platform: string): string {
        if (!adData.interactive?.companions) return '';

        return `
            <Creative>
                <CompanionAds>
                    ${adData.interactive.companions.map(companion => `
                        <Companion width="${companion.width}" height="${companion.height}">
                            <StaticResource creativeType="image/jpeg">
                                <![CDATA[${companion.url}]]>
                            </StaticResource>
                            <CompanionClickThrough>
                                <![CDATA[${companion.clickThroughUrl}]]>
                            </CompanionClickThrough>
                        </Companion>
                    `).join('')}
                </CompanionAds>
            </Creative>`;
    }

    private generatePlatformExtensions(platform: string, options: any): string {
        let extensions = '';

        // Extensión SAMID para Samsung
        if (platform === 'samsungTV' && options.samId) {
            extensions += `
                <Extension type="SAMID">
                    <CreativeID>${options.samId}</CreativeID>
                    <CreativeType>Interactive</CreativeType>
                </Extension>`;
        }

        // Extensión DV360
        if (options.dv360CampaignId || options.dv360CreativeId) {
            extensions += `
                <Extension type="DV360">
                    <CampaignID>${options.dv360CampaignId || ''}</CampaignID>
                    <CreativeID>${options.dv360CreativeId || ''}</CreativeID>
                </Extension>`;
        }

        return extensions;
    }

    private generateInteractiveExtensions(config: InteractiveConfig | null, platform: string): string {
        if (!config) return '';

        return `
            <Extension type="InteractiveConfig">
                <Framework>${config.framework || 'HTML5'}</Framework>
                <RemoteControl>true</RemoteControl>
                <NavigationMap>${JSON.stringify(this.generateNavigationMap(config))}</NavigationMap>
            </Extension>`;
    }

    private generateNavigationMap(config: InteractiveConfig): any {
        // Generar mapa de navegación para controles remotos
        const elements = [];
        
        if (config.actions) {
            config.actions.forEach((action, index) => {
                if (action.type === 'button') {
                    elements.push({
                        id: `button_${index}`,
                        type: 'button',
                        position: action.data?.position,
                        up: `button_${index - 1}`,
                        down: `button_${index + 1}`,
                        action: {
                            type: 'click',
                            url: action.url
                        }
                    });
                } else if (action.type === 'carousel') {
                    elements.push({
                        id: 'carousel',
                        type: 'carousel',
                        position: action.data?.position,
                        left: 'previous',
                        right: 'next',
                        items: action.data?.items
                    });
                }
            });
        }

        return {
            version: "1.0",
            defaultFocus: "button_0",
            elements
        };
    }

    private formatDuration(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    private replaceMacros(url: string, { timestamp, cacheBuster }: { timestamp: number; cacheBuster: number }): string {
        return url
            .replace(/\[TIMESTAMP\]/g, timestamp.toString())
            .replace(/\[CACHEBUSTING\]/g, cacheBuster.toString());
    }

    private generateTrackingEvents(events: Record<string, string>, macros: { timestamp: number; cacheBuster: number }): string {
        return Object.entries(events)
            .map(([event, url]) => `
                <Tracking event="${event}">
                    <![CDATA[${this.replaceMacros(url, macros)}]]>
                </Tracking>
            `).join('');
    }

    private generateVerificationSection(options: { enableVerification?: boolean; dv360CampaignId?: string; dv360CreativeId?: string }): string {
        if (!options.enableVerification) return '';

        return `
            <AdVerifications>
                <Verification vendor="doubleverify">
                    <JavaScriptResource>
                        <![CDATA[https://cdn.doubleverify.com/dvtp_src.js]]>
                    </JavaScriptResource>
                    <VerificationParameters>
                        <![CDATA[
                            ctx=13337537&cmp=${options.dv360CampaignId || ''}&plc=&sid=&advid=&adsrv=1&crt=${options.dv360CreativeId || ''}&crtname=&tagtype=video&dvtagver=6.1.src&msrapi=jsOmid
                        ]]>
                    </VerificationParameters>
                </Verification>
            </AdVerifications>`;
    }

    private generateMediaFiles(adData: any, platform: string): string {
        const platformSpec = CTV_PLATFORMS[platform];
        if (!platformSpec) return '';

        return adData.videoVariants
            .filter(variant => variant.platform === platform)
            .map(variant => `
                <MediaFile 
                    delivery="progressive" 
                    type="video/${variant.format.codec === 'h264' ? 'mp4' : 'hevc'}" 
                    width="${variant.format.width}" 
                    height="${variant.format.height}" 
                    bitrate="${variant.format.bitrate * 1000000}"
                    codec="${variant.format.codec.toUpperCase()}"
                    maintainAspectRatio="true">
                    <![CDATA[${variant.url}]]>
                </MediaFile>
            `).join('');
    }

    private generateInteractionTrackingEvents(events: Record<string, string> = {}, macros: { timestamp: number; cacheBuster: number }): string {
        return Object.entries(events)
            .map(([event, url]) => `
                <Tracking event="${event}">
                    <![CDATA[${this.replaceMacros(url, macros)}]]>
                </Tracking>
            `).join('');
    }

    validateVastXml(xml: string): { isValid: boolean; errors: string[] } {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'application/xml');
            const errors: string[] = [];

            // Validar elementos requeridos
            const requiredElements = [
                'VAST', 'Ad', 'InLine', 'AdSystem', 'AdTitle',
                'Impression', 'Creatives', 'Creative', 'Linear',
                'Duration', 'MediaFiles'
            ];

            requiredElements.forEach(element => {
                if (!doc.getElementsByTagName(element).length) {
                    errors.push(`Falta elemento requerido: ${element}`);
                }
            });

            // Validar atributos
            const vast = doc.getElementsByTagName('VAST')[0];
            if (!vast.getAttribute('version')) {
                errors.push('Falta atributo version en VAST');
            }

            // Validar MediaFiles
            const mediaFiles = doc.getElementsByTagName('MediaFile');
            if (mediaFiles.length === 0) {
                errors.push('No hay MediaFiles definidos');
            }

            for (const mediaFile of Array.from(mediaFiles)) {
                const requiredAttrs = ['delivery', 'type', 'width', 'height', 'codec'];
                requiredAttrs.forEach(attr => {
                    if (!mediaFile.getAttribute(attr)) {
                        errors.push(`MediaFile falta atributo: ${attr}`);
                    }
                });
            }

            return {
                isValid: errors.length === 0,
                errors
            };
        } catch (error) {
            return {
                isValid: false,
                errors: [(error as Error).message]
            };
        }
    }
} 