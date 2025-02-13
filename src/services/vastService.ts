import { VideoConfig } from '../types/video';

interface TrackingEvents {
  start: string;
  firstQuartile: string;
  midpoint: string;
  thirdQuartile: string;
  complete: string;
  click: string;
}

export const generateVastXml = (
  videoUrl: string,
  config: VideoConfig,
  trackingBaseUrl: string,
  adId: string
): string => {
  const timestamp = Date.now();
  const cacheBuster = Math.floor(Math.random() * 10000000);
  
  const trackingEvents: TrackingEvents = {
    start: `${trackingBaseUrl}/track/start?id=${adId}&cb=[CACHEBUSTING]&ts=[TIMESTAMP]`,
    firstQuartile: `${trackingBaseUrl}/track/firstQuartile?id=${adId}&cb=[CACHEBUSTING]&ts=[TIMESTAMP]`,
    midpoint: `${trackingBaseUrl}/track/midpoint?id=${adId}&cb=[CACHEBUSTING]&ts=[TIMESTAMP]`,
    thirdQuartile: `${trackingBaseUrl}/track/thirdQuartile?id=${adId}&cb=[CACHEBUSTING]&ts=[TIMESTAMP]`,
    complete: `${trackingBaseUrl}/track/complete?id=${adId}&cb=[CACHEBUSTING]&ts=[TIMESTAMP]`,
    click: `${trackingBaseUrl}/track/click?id=${adId}&cb=[CACHEBUSTING]&ts=[TIMESTAMP]`,
  };

  const vastXml = `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="4.0">
  <Ad id="${adId}">
    <InLine>
      <AdSystem>Adsmood CTV Platform</AdSystem>
      <AdTitle>CTV Ad ${timestamp}</AdTitle>
      <Impression><![CDATA[${trackingBaseUrl}/track/impression?id=${adId}&cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></Impression>
      <Creatives>
        <Creative id="${adId}_1">
          <Linear>
            <Duration>00:00:30</Duration>
            <TrackingEvents>
              <Tracking event="start"><![CDATA[${trackingEvents.start}]]></Tracking>
              <Tracking event="firstQuartile"><![CDATA[${trackingEvents.firstQuartile}]]></Tracking>
              <Tracking event="midpoint"><![CDATA[${trackingEvents.midpoint}]]></Tracking>
              <Tracking event="thirdQuartile"><![CDATA[${trackingEvents.thirdQuartile}]]></Tracking>
              <Tracking event="complete"><![CDATA[${trackingEvents.complete}]]></Tracking>
            </TrackingEvents>
            <VideoClicks>
              <ClickThrough><![CDATA[${trackingBaseUrl}/click?id=${adId}&cb=[CACHEBUSTING]&ts=[TIMESTAMP]]]></ClickThrough>
              <ClickTracking><![CDATA[${trackingEvents.click}]]></ClickTracking>
            </VideoClicks>
            <MediaFiles>
              <MediaFile delivery="progressive" type="video/mp4" width="${config.width}" height="${config.height}" codec="${config.videoCodec}"><![CDATA[${videoUrl}]]></MediaFile>
            </MediaFiles>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>`;

  return vastXml;
}; 