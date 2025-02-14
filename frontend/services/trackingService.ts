interface TrackingEvent {
  id: string;
  eventType: string;
  timestamp: number;
  platform?: string;
  userAgent?: string;
  ipAddress?: string;
}

export const trackEvent = async (event: TrackingEvent): Promise<void> => {
  try {
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Event tracked successfully: ${event.eventType} for ad ${event.id}`);
  } catch (error) {
    console.error('Error tracking event:', error);
    // Aquí podríamos implementar retry logic o enviar a una cola de eventos fallidos
  }
};

export const replaceMacros = (url: string): string => {
  return url
    .replace('[TIMESTAMP]', Date.now().toString())
    .replace('[CACHEBUSTING]', Math.floor(Math.random() * 10000000).toString());
}; 