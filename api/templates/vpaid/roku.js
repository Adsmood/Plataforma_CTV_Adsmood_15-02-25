/**
 * VPAID Template para Roku usando RAF (Roku Advertising Framework)
 */
(function() {
    'use strict';

    var VPAIDInterface = function() {
        this.RAF = null;
        this.slot = null;
        this.videoSlot = null;
        this.eventsCallbacks = {};
        this.attributes = {
            companions: [],
            desiredBitrate: 256,
            duration: 30,
            expanded: false,
            height: 1080,
            icons: [],
            linear: true,
            remainingTime: 30,
            skippable: false,
            viewMode: 'normal',
            width: 1920,
            volume: 1.0
        };
        this.quartileEvents = [
            { event: 'AdVideoStart', value: 0 },
            { event: 'AdVideoFirstQuartile', value: 25 },
            { event: 'AdVideoMidpoint', value: 50 },
            { event: 'AdVideoThirdQuartile', value: 75 },
            { event: 'AdVideoComplete', value: 100 }
        ];
        this.interactiveConfig = null;
    };

    VPAIDInterface.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
        this.attributes.width = width;
        this.attributes.height = height;
        this.attributes.viewMode = viewMode;
        this.attributes.desiredBitrate = desiredBitrate;
        
        try {
            // Parsear la configuración interactiva
            this.interactiveConfig = JSON.parse(creativeData.AdParameters);
            
            // Inicializar RAF
            this.RAF = environmentVars.RAF;
            this.slot = environmentVars.slot;
            this.videoSlot = environmentVars.videoSlot;

            // Configurar elementos interactivos
            this.setupInteractiveElements();

            // Disparar evento de inicialización
            this.callEvent('AdLoaded');
        } catch (e) {
            this.callEvent('AdError', 'Error initializing ad: ' + e.message);
        }
    };

    VPAIDInterface.prototype.setupInteractiveElements = function() {
        if (!this.interactiveConfig || !this.RAF) return;

        // Configurar navegación con control remoto
        this.RAF.setNavigationMap(this.interactiveConfig.navigationMap);

        // Configurar acciones para cada elemento interactivo
        if (this.interactiveConfig.actions) {
            this.interactiveConfig.actions.forEach(action => {
                switch (action.type) {
                    case 'button':
                        this.RAF.createButton({
                            id: action.id,
                            label: action.label,
                            position: action.data.position,
                            onClick: () => {
                                this.callEvent('AdClickThru', action.url);
                                this.trackInteraction('button_click', { buttonId: action.id });
                            }
                        });
                        break;
                    case 'carousel':
                        this.RAF.createCarousel({
                            id: action.id,
                            items: action.data.items,
                            position: action.data.position,
                            onItemFocus: (item) => {
                                this.trackInteraction('carousel_focus', { itemId: item.id });
                            },
                            onItemSelect: (item) => {
                                this.callEvent('AdClickThru', item.actionUrl);
                                this.trackInteraction('carousel_select', { itemId: item.id });
                            }
                        });
                        break;
                }
            });
        }
    };

    VPAIDInterface.prototype.startAd = function() {
        this.callEvent('AdStarted');
        this.callEvent('AdImpression');
        
        // Iniciar tracking de cuartiles
        this.setupQuartileTracking();
    };

    VPAIDInterface.prototype.stopAd = function() {
        // Limpiar elementos interactivos
        if (this.RAF) {
            this.RAF.clearInteractiveElements();
        }
        
        this.callEvent('AdStopped');
    };

    VPAIDInterface.prototype.skipAd = function() {
        this.stopAd();
        this.callEvent('AdSkipped');
    };

    VPAIDInterface.prototype.setAdVolume = function(value) {
        this.attributes.volume = value;
        this.callEvent('AdVolumeChange');
    };

    VPAIDInterface.prototype.getAdVolume = function() {
        return this.attributes.volume;
    };

    VPAIDInterface.prototype.resizeAd = function(width, height, viewMode) {
        this.attributes.width = width;
        this.attributes.height = height;
        this.attributes.viewMode = viewMode;
        this.callEvent('AdSizeChange');
    };

    VPAIDInterface.prototype.pauseAd = function() {
        this.callEvent('AdPaused');
    };

    VPAIDInterface.prototype.resumeAd = function() {
        this.callEvent('AdPlaying');
    };

    VPAIDInterface.prototype.expandAd = function() {
        this.attributes.expanded = true;
        this.callEvent('AdExpandedChange');
    };

    VPAIDInterface.prototype.collapseAd = function() {
        this.attributes.expanded = false;
        this.callEvent('AdExpandedChange');
    };

    VPAIDInterface.prototype.subscribe = function(callback, event, context) {
        this.eventsCallbacks[event] = callback.bind(context);
    };

    VPAIDInterface.prototype.unsubscribe = function(event) {
        this.eventsCallbacks[event] = null;
    };

    VPAIDInterface.prototype.callEvent = function(eventType, data) {
        if (this.eventsCallbacks[eventType]) {
            this.eventsCallbacks[eventType](data);
        }
    };

    VPAIDInterface.prototype.trackInteraction = function(type, data) {
        // Enviar evento de interacción al servidor de tracking
        if (this.interactiveConfig && this.interactiveConfig.trackingEndpoints) {
            const endpoint = this.interactiveConfig.trackingEndpoints[type];
            if (endpoint) {
                const timestamp = Date.now();
                const url = endpoint
                    .replace('[TIMESTAMP]', timestamp)
                    .replace('[DATA]', encodeURIComponent(JSON.stringify(data)));
                
                // Usar RAF para enviar el ping
                this.RAF.sendTrackingPixel(url);
            }
        }
    };

    VPAIDInterface.prototype.setupQuartileTracking = function() {
        let lastQuartile = -1;
        
        // Monitorear el progreso del video
        this.videoSlot.addEventListener('timeupdate', () => {
            const percentComplete = (this.videoSlot.currentTime / this.videoSlot.duration) * 100;
            
            this.quartileEvents.forEach(quartile => {
                if (percentComplete >= quartile.value && lastQuartile < quartile.value) {
                    this.callEvent(quartile.event);
                    lastQuartile = quartile.value;
                }
            });
        });
    };

    // Getters requeridos por la especificación VPAID
    VPAIDInterface.prototype.getAdLinear = function() { return this.attributes.linear; };
    VPAIDInterface.prototype.getAdWidth = function() { return this.attributes.width; };
    VPAIDInterface.prototype.getAdHeight = function() { return this.attributes.height; };
    VPAIDInterface.prototype.getAdExpanded = function() { return this.attributes.expanded; };
    VPAIDInterface.prototype.getAdSkippableState = function() { return this.attributes.skippable; };
    VPAIDInterface.prototype.getAdRemainingTime = function() { return this.attributes.remainingTime; };
    VPAIDInterface.prototype.getAdDuration = function() { return this.attributes.duration; };
    VPAIDInterface.prototype.getAdCompanions = function() { return this.attributes.companions; };
    VPAIDInterface.prototype.getAdIcons = function() { return this.attributes.icons; };

    // Exponer la interfaz VPAID
    window.getVPAIDAd = function() {
        return new VPAIDInterface();
    };
})(); 