// Anti-Detection Helpers
// These techniques make the browser fingerprint more consistent and realistic
// while avoiding the joint-inconsistency mistakes that Brave farbling makes.

(function() {
    'use strict';

    // =========================================================================
    // 1. Session-seeded PRNG (mulberry32)
    //    One seed per page load, deterministic within session. Canvas and audio
    //    noise use this so the fingerprint hash is stable across calls within
    //    a single page but varies across sessions.
    // =========================================================================
    const _seed = crypto.getRandomValues(new Uint32Array(1))[0];
    let _state = _seed;

    function mulberry32() {
        _state |= 0;
        _state = _state + 0x6D2B79F5 | 0;
        let t = Math.imul(_state ^ (_state >>> 15), 1 | _state);
        t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    // =========================================================================
    // 2. Prevent detection of property overrides
    // =========================================================================
    const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    const hiddenProperties = new Set();

    window.hidePropertyOverride = function(obj, prop) {
        hiddenProperties.add(`${obj.constructor.name}.${prop}`);
    };

    Object.getOwnPropertyDescriptor = function(obj, prop) {
        const key = `${obj.constructor.name}.${prop}`;
        if (hiddenProperties.has(key)) {
            return {
                value: obj[prop],
                writable: true,
                enumerable: true,
                configurable: true
            };
        }
        return originalGetOwnPropertyDescriptor.apply(this, arguments);
    };

    // =========================================================================
    // 3. Platform-aware touch events
    //    iPhone must have touch; macOS must not. Windows can have 0 or 2
    //    depending on hardware — we set 0 as default (non-touch desktop).
    // =========================================================================
    function addTouchSupport() {
        if (navigator.platform === 'iPhone') {
            Object.defineProperty(navigator, 'maxTouchPoints', {
                get: () => 5,
                configurable: true
            });
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
        } else if (navigator.platform === 'Linux armv81') {
            // Android: touch-capable
            Object.defineProperty(navigator, 'maxTouchPoints', {
                get: () => 5,
                configurable: true
            });
            window.TouchEvent = window.TouchEvent || class TouchEvent extends UIEvent {};
        }
    }

    // =========================================================================
    // 4. WebGL Fingerprint Consistency
    //    Updated 2026-04: Safari 26 reports generic "Apple GPU" instead of
    //    specific chip names. Win32 keeps ANGLE format. Android uses bare
    //    vendor names (e.g., "Qualcomm").
    // =========================================================================
    function normalizeWebGLFingerprint() {
        const getParameterProxyHandler = {
            apply: function(target, thisArg, argumentsList) {
                const parameter = argumentsList[0];

                if (parameter === 37445) { // UNMASKED_VENDOR_WEBGL
                    if (navigator.platform === 'Win32') {
                        return 'Google Inc. (NVIDIA)';
                    } else if (navigator.platform === 'MacIntel') {
                        return 'Apple Inc.';
                    } else if (navigator.platform === 'iPhone') {
                        return 'Apple Inc.';
                    } else if (navigator.platform === 'Linux armv81') {
                        return 'Qualcomm';
                    }
                }

                if (parameter === 37446) { // UNMASKED_RENDERER_WEBGL
                    if (navigator.platform === 'Win32') {
                        return 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Direct3D11 vs_5_0 ps_5_0, D3D11)';
                    } else if (navigator.platform === 'MacIntel') {
                        return 'Apple GPU';
                    } else if (navigator.platform === 'iPhone') {
                        return 'Apple GPU';
                    } else if (navigator.platform === 'Linux armv81') {
                        return 'Adreno (TM) 650';
                    }
                }

                return Reflect.apply(target, thisArg, argumentsList);
            }
        };

        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function(type, ...args) {
            const context = originalGetContext.call(this, type, ...args);

            if (context && type.includes('webgl')) {
                context.getParameter = new Proxy(context.getParameter, getParameterProxyHandler);
            }

            return context;
        };
    }

    // =========================================================================
    // 5. Canvas Fingerprinting — Session-seeded LSB noise
    //    Flips the LSB of ~0.5% of pixel channels, chosen deterministically
    //    by the session PRNG. This produces a stable per-session canvas hash
    //    that differs across sessions.
    //
    //    Previous bug: used Math.random() * 0.0001 as float addition to
    //    Uint8Clamped values, which truncated to zero — noise had no effect.
    // =========================================================================
    function addCanvasNoise() {
        const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
        const originalToBlob = HTMLCanvasElement.prototype.toBlob;
        const originalGetImageData = CanvasRenderingContext2D.prototype.getImageData;

        // Noise applied once per canvas via a WeakSet to avoid double-noising
        const noisedCanvases = new WeakSet();

        function applyNoise(canvas) {
            if (noisedCanvases.has(canvas)) return;
            const context = canvas.getContext('2d');
            if (!context) return;
            // Mark before reading pixels, and read via the saved native
            // getImageData: the patched prototype method calls applyNoise
            // first, so going through it here (or leaving the guard unset
            // until after noising) recurses until the call stack overflows.
            noisedCanvases.add(canvas);
            try {
                const imageData = originalGetImageData.call(context, 0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    // Flip LSB of ~0.5% of pixels (deterministic via seeded PRNG)
                    if (mulberry32() < 0.005) {
                        data[i] = data[i] ^ 1;       // R
                    }
                    if (mulberry32() < 0.005) {
                        data[i + 1] = data[i + 1] ^ 1; // G
                    }
                    if (mulberry32() < 0.005) {
                        data[i + 2] = data[i + 2] ^ 1; // B
                    }
                }
                context.putImageData(imageData, 0, 0);
            } catch (e) {
                // SecurityError from cross-origin canvas — skip silently
            }
        }

        HTMLCanvasElement.prototype.toDataURL = function(...args) {
            applyNoise(this);
            return originalToDataURL.apply(this, args);
        };

        HTMLCanvasElement.prototype.toBlob = function(...args) {
            applyNoise(this);
            return originalToBlob.apply(this, args);
        };

        CanvasRenderingContext2D.prototype.getImageData = function(...args) {
            applyNoise(this.canvas);
            return originalGetImageData.apply(this, args);
        };
    }

    // =========================================================================
    // 6. Audio Fingerprinting — Session-seeded noise
    //    Adds tiny deterministic noise to frequency data so the audio
    //    fingerprint hash varies per session but is stable within one.
    // =========================================================================
    function protectAudioFingerprint() {
        const audioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioContext) return;

        const OriginalAnalyser = audioContext.prototype.createAnalyser;
        audioContext.prototype.createAnalyser = function() {
            const analyser = OriginalAnalyser.call(this);
            const originalGetFloatFrequencyData = analyser.getFloatFrequencyData;

            analyser.getFloatFrequencyData = function(array) {
                originalGetFloatFrequencyData.call(this, array);
                for (let i = 0; i < array.length; i++) {
                    // Session-seeded noise, same magnitude as before
                    array[i] += (mulberry32() - 0.5) * 0.002;
                }
                return array;
            };

            return analyser;
        };
    }

    // =========================================================================
    // 7. Performance API Consistency
    //    performance.memory is Chromium-only. Only define it for Win32
    //    (Chrome/Edge) where it's expected.
    // =========================================================================
    function normalizePerformanceAPI() {
        if (!performance.memory && (navigator.platform === 'Win32' || navigator.platform === 'Linux armv81')) {
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

    // =========================================================================
    // Initialize all protections
    // =========================================================================
    function initializeAntiDetection() {
        try {
            addTouchSupport();
            normalizeWebGLFingerprint();
            normalizePerformanceAPI();
            addCanvasNoise();
            protectAudioFingerprint();
        } catch (error) {
            // Fail silently — do not expose extension presence via console
        }
    }

    initializeAntiDetection();
})();
