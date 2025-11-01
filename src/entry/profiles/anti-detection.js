// Anti-Detection Helpers
// These techniques make the browser fingerprint more consistent and realistic

// 1. Prevent detection of property overrides
(function() {
    'use strict';

    // Store original functions to avoid detection
    const originalDefineProperty = Object.defineProperty;
    const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

    // Make our overrides undetectable by hiding property descriptors
    const hiddenProperties = new Set();

    window.hidePropertyOverride = function(obj, prop) {
        hiddenProperties.add(`${obj.constructor.name}.${prop}`);
    };

    // Override Object.getOwnPropertyDescriptor to hide our modifications
    Object.getOwnPropertyDescriptor = function(obj, prop) {
        const key = `${obj.constructor.name}.${prop}`;
        if (hiddenProperties.has(key)) {
            // Return a descriptor that looks native
            return {
                value: obj[prop],
                writable: true,
                enumerable: true,
                configurable: true
            };
        }
        return originalGetOwnPropertyDescriptor.apply(this, arguments);
    };
})();

// 2. Add realistic touch events for mobile profiles
function addTouchSupport() {
    if (navigator.platform === 'iPhone') {
        Object.defineProperty(navigator, 'maxTouchPoints', {
            get: () => 5,
            configurable: true
        });

        // Add touch event support
        window.TouchEvent = window.TouchEvent || class TouchEvent extends UIEvent {};
    } else if (navigator.platform === 'Win32') {
        Object.defineProperty(navigator, 'maxTouchPoints', {
            get: () => 0,
            configurable: true
        });
    } else if (navigator.platform === 'MacIntel') {
        Object.defineProperty(navigator, 'maxTouchPoints', {
            get: () => 0,
            configurable: true
        });
    }
}

// 3. WebGL Fingerprint Consistency
function normalizeWebGLFingerprint() {
    const getParameterProxyHandler = {
        apply: function(target, thisArg, argumentsList) {
            const parameter = argumentsList[0];

            // Return consistent values based on platform
            if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
                if (navigator.platform === 'Win32') {
                    return 'Google Inc. (NVIDIA)';
                } else if (navigator.platform === 'MacIntel') {
                    return 'Apple Inc.';
                } else if (navigator.platform === 'iPhone') {
                    return 'Apple Inc.';
                }
            }

            if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
                if (navigator.platform === 'Win32') {
                    return 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)';
                } else if (navigator.platform === 'MacIntel') {
                    return 'Apple M1';
                } else if (navigator.platform === 'iPhone') {
                    return 'Apple A15 GPU';
                }
            }

            return Reflect.apply(target, thisArg, argumentsList);
        }
    };

    // Apply to all WebGL contexts
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
        const context = originalGetContext.call(this, type, ...args);

        if (context && type.includes('webgl')) {
            context.getParameter = new Proxy(context.getParameter, getParameterProxyHandler);
        }

        return context;
    };
}

// 4. Canvas Fingerprinting - Add slight noise (not too much to break sites)
function addCanvasNoise() {
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
    const originalToBlob = HTMLCanvasElement.prototype.toBlob;
    const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

    // Add minimal noise to make fingerprint unique but consistent per session
    const sessionNoise = Math.random() * 0.0001; // Very small noise

    HTMLCanvasElement.prototype.toDataURL = function(...args) {
        const context = this.getContext('2d');
        if (context) {
            // Add imperceptible noise
            const imageData = context.getImageData(0, 0, this.width, this.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
                imageData.data[i] = imageData.data[i] + sessionNoise; // R
                imageData.data[i + 1] = imageData.data[i + 1] + sessionNoise; // G
                imageData.data[i + 2] = imageData.data[i + 2] + sessionNoise; // B
            }
            context.putImageData(imageData, 0, 0);
        }
        return originalToDataURL.apply(this, args);
    };
}

// 5. Audio Fingerprinting Protection
function protectAudioFingerprint() {
    const audioContext = window.AudioContext || window.webkitAudioContext;
    if (audioContext) {
        const OriginalAnalyser = audioContext.prototype.createAnalyser;
        audioContext.prototype.createAnalyser = function() {
            const analyser = OriginalAnalyser.call(this);
            const originalGetFloatFrequencyData = analyser.getFloatFrequencyData;

            analyser.getFloatFrequencyData = function(array) {
                originalGetFloatFrequencyData.call(this, array);
                // Add tiny consistent noise
                for (let i = 0; i < array.length; i++) {
                    array[i] += Math.random() * 0.001;
                }
                return array;
            };

            return analyser;
        };
    }
}

// 6. Font Fingerprinting Protection
function protectFontFingerprint() {
    // Don't completely block font detection, just make it consistent
    // Most sites need font detection for legitimate purposes
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function(...args) {
        const style = originalGetComputedStyle.apply(this, args);
        // Return style as-is but log attempts to detect fonts
        return style;
    };
}

// 7. Performance API Consistency
function normalizePerformanceAPI() {
    // Add realistic performance.memory if it doesn't exist
    if (!performance.memory && navigator.platform === 'Win32') {
        Object.defineProperty(performance, 'memory', {
            get: () => ({
                jsHeapSizeLimit: 2172649472,
                totalJSHeapSize: 50000000,
                usedJSHeapSize: 30000000
            }),
            configurable: true
        });
    }
}

// Initialize all protections
function initializeAntiDetection() {
    try {
        addTouchSupport();
        normalizeWebGLFingerprint();
        normalizePerformanceAPI();

        // Optional: Enable canvas/audio protection if needed
        // These can sometimes break legitimate functionality
        // addCanvasNoise();
        // protectAudioFingerprint();

        console.log('[Anti-Detection] Protections initialized');
    } catch (error) {
        console.error('[Anti-Detection] Error initializing:', error);
    }
}

// Run immediately
initializeAntiDetection();
