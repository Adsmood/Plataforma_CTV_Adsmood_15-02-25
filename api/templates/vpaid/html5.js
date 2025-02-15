/**
 * VPAID Template para Android TV y Samsung TV usando HTML5
 */
(function() {
    'use strict';

    var VPAIDInterface = function() {
        this.slot = null;
        this.videoSlot = null;
        this.overlay = null;
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
        this.focusedElement = null;
    };

    VPAIDInterface.prototype.initAd = function(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
        this.attributes.width = width;
        this.attributes.height = height;
        this.attributes.viewMode = viewMode;
        this.attributes.desiredBitrate = desiredBitrate;
        
        try {
            // Parsear la configuración interactiva
            this.interactiveConfig = JSON.parse(creativeData.AdParameters);
            
            // Inicializar elementos del DOM
            this.slot = environmentVars.slot;
            this.videoSlot = environmentVars.videoSlot;

            // Crear overlay para elementos interactivos
            this.overlay = document.createElement('div');
            this.overlay.className = 'interactive-overlay';
            this.overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1000;
            `;
            this.slot.appendChild(this.overlay);

            // Configurar elementos interactivos
            this.setupInteractiveElements();

            // Configurar manejo de eventos del control remoto
            this.setupRemoteControl();

            // Disparar evento de inicialización
            this.callEvent('AdLoaded');
        } catch (e) {
            this.callEvent('AdError', 'Error initializing ad: ' + e.message);
        }
    };

    VPAIDInterface.prototype.setupInteractiveElements = function() {
        if (!this.interactiveConfig || !this.overlay) return;

        // Crear elementos interactivos
        if (this.interactiveConfig.actions) {
            this.interactiveConfig.actions.forEach(action => {
                switch (action.type) {
                    case 'button':
                        this.createButton(action);
                        break;
                    case 'carousel':
                        this.createCarousel(action);
                        break;
                    case 'gallery':
                        this.createGallery(action);
                        break;
                }
            });
        }

        // Configurar navegación inicial
        this.setupInitialFocus();
    };

    VPAIDInterface.prototype.createButton = function(action) {
        const button = document.createElement('button');
        button.id = action.id;
        button.className = 'interactive-button';
        button.textContent = action.label;
        button.setAttribute('data-focusable', 'true');
        button.style.cssText = `
            position: absolute;
            left: ${action.data.position.x}px;
            top: ${action.data.position.y}px;
            padding: 12px 24px;
            border: none;
            border-radius: 4px;
            background: rgba(74, 144, 226, 0.9);
            color: white;
            font-size: 18px;
            cursor: pointer;
            pointer-events: auto;
            transition: transform 0.2s, box-shadow 0.2s;
            ${action.data.style || ''}
        `;

        button.addEventListener('focus', () => {
            this.focusedElement = button;
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.5)';
            this.trackInteraction('button_focus', { buttonId: action.id });
        });

        button.addEventListener('blur', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        });

        button.addEventListener('click', () => {
            this.callEvent('AdClickThru', action.url);
            this.trackInteraction('button_click', { buttonId: action.id });
        });

        this.overlay.appendChild(button);
    };

    VPAIDInterface.prototype.createCarousel = function(action) {
        const carousel = document.createElement('div');
        carousel.id = action.id;
        carousel.className = 'interactive-carousel';
        carousel.setAttribute('data-focusable', 'true');
        carousel.style.cssText = `
            position: absolute;
            left: ${action.data.position.x}px;
            top: ${action.data.position.y}px;
            display: flex;
            gap: 20px;
            pointer-events: auto;
            ${action.data.style || ''}
        `;

        action.data.items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'carousel-item';
            card.setAttribute('data-focusable', 'true');
            card.setAttribute('data-item-index', index.toString());
            card.style.cssText = `
                flex: 0 0 300px;
                padding: 16px;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 8px;
                transition: transform 0.2s, box-shadow 0.2s;
            `;

            card.innerHTML = `
                <img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 4px;">
                <h3 style="margin: 8px 0; color: white;">${item.title}</h3>
                <p style="margin: 0; color: #ccc;">${item.description}</p>
                ${item.price ? `<p style="margin: 8px 0; color: #4a90e2; font-weight: bold;">${item.price}</p>` : ''}
            `;

            card.addEventListener('focus', () => {
                this.focusedElement = card;
                card.style.transform = 'scale(1.1)';
                card.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.5)';
                this.trackInteraction('carousel_focus', { itemId: index });
            });

            card.addEventListener('blur', () => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = 'none';
            });

            card.addEventListener('click', () => {
                this.callEvent('AdClickThru', item.url);
                this.trackInteraction('carousel_select', { itemId: index });
            });

            carousel.appendChild(card);
        });

        this.overlay.appendChild(carousel);
    };

    VPAIDInterface.prototype.createGallery = function(action) {
        const gallery = document.createElement('div');
        gallery.id = action.id;
        gallery.className = 'interactive-gallery';
        gallery.setAttribute('data-focusable', 'true');
        gallery.style.cssText = `
            position: absolute;
            left: ${action.data.position.x}px;
            top: ${action.data.position.y}px;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            pointer-events: auto;
            ${action.data.style || ''}
        `;

        action.data.images.forEach((image, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-focusable', 'true');
            item.setAttribute('data-item-index', index.toString());
            item.style.cssText = `
                position: relative;
                aspect-ratio: 16/9;
                border-radius: 8px;
                overflow: hidden;
                transition: transform 0.2s, box-shadow 0.2s;
            `;

            item.innerHTML = `
                <img src="${image.url}" alt="${image.title || ''}" style="width: 100%; height: 100%; object-fit: cover;">
                ${image.title ? `
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; background: linear-gradient(transparent, rgba(0,0,0,0.8));">
                        <h4 style="margin: 0; color: white;">${image.title}</h4>
                        ${image.description ? `<p style="margin: 4px 0 0; color: #ccc;">${image.description}</p>` : ''}
                    </div>
                ` : ''}
            `;

            item.addEventListener('focus', () => {
                this.focusedElement = item;
                item.style.transform = 'scale(1.1)';
                item.style.boxShadow = '0 0 20px rgba(74, 144, 226, 0.5)';
                this.trackInteraction('gallery_focus', { imageId: index });
            });

            item.addEventListener('blur', () => {
                item.style.transform = 'scale(1)';
                item.style.boxShadow = 'none';
            });

            item.addEventListener('click', () => {
                if (image.url) {
                    this.callEvent('AdClickThru', image.url);
                }
                this.trackInteraction('gallery_select', { imageId: index });
            });

            gallery.appendChild(item);
        });

        this.overlay.appendChild(gallery);
    };

    VPAIDInterface.prototype.setupInitialFocus = function() {
        // Encontrar el primer elemento focusable
        const firstFocusable = this.overlay.querySelector('[data-focusable="true"]');
        if (firstFocusable) {
            firstFocusable.focus();
            this.focusedElement = firstFocusable;
        }
    };

    VPAIDInterface.prototype.setupRemoteControl = function() {
        document.addEventListener('keydown', (event) => {
            if (!this.focusedElement) return;

            const currentIndex = parseInt(this.focusedElement.getAttribute('data-item-index') || '0');
            let nextElement = null;

            switch (event.key) {
                case 'ArrowUp':
                    nextElement = this.findNextFocusableElement('up');
                    break;
                case 'ArrowDown':
                    nextElement = this.findNextFocusableElement('down');
                    break;
                case 'ArrowLeft':
                    nextElement = this.findNextFocusableElement('left');
                    break;
                case 'ArrowRight':
                    nextElement = this.findNextFocusableElement('right');
                    break;
                case 'Enter':
                    this.focusedElement.click();
                    break;
                case 'Escape':
                case 'Back':
                    this.trackInteraction('remote_back');
                    break;
            }

            if (nextElement) {
                nextElement.focus();
                event.preventDefault();
            }
        });
    };

    VPAIDInterface.prototype.findNextFocusableElement = function(direction) {
        if (!this.focusedElement) return null;

        const rect = this.focusedElement.getBoundingClientRect();
        const focusables = Array.from(this.overlay.querySelectorAll('[data-focusable="true"]'));
        
        return focusables.reduce((closest, current) => {
            if (current === this.focusedElement) return closest;

            const currentRect = current.getBoundingClientRect();
            let isInDirection = false;

            switch (direction) {
                case 'up':
                    isInDirection = currentRect.bottom < rect.top;
                    break;
                case 'down':
                    isInDirection = currentRect.top > rect.bottom;
                    break;
                case 'left':
                    isInDirection = currentRect.right < rect.left;
                    break;
                case 'right':
                    isInDirection = currentRect.left > rect.right;
                    break;
            }

            if (!isInDirection) return closest;

            const distance = Math.hypot(
                currentRect.left - rect.left,
                currentRect.top - rect.top
            );

            if (!closest || distance < closest.distance) {
                return { element: current, distance };
            }

            return closest;
        }, null)?.element || null;
    };

    VPAIDInterface.prototype.startAd = function() {
        this.callEvent('AdStarted');
        this.callEvent('AdImpression');
        
        // Iniciar tracking de cuartiles
        this.setupQuartileTracking();
    };

    VPAIDInterface.prototype.stopAd = function() {
        // Limpiar overlay
        if (this.overlay) {
            this.overlay.remove();
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
                
                // Enviar ping de tracking
                const img = new Image();
                img.src = url;
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