/* eslint-disable @typescript-eslint/no-empty-function */
console.log("inside randomizing for profile2")
// Profile 2: MacBook Air - Realistic Safari configuration
Object.defineProperty(navigator, "platform", {
	get: () => "MacIntel",
});

// Safari on Mac has PDF plugins
Object.defineProperty(navigator, "plugins", {
	get: () => {
		return {
			length: 2,
			item: (index) => {
				const pluginList = [
					{ name: "PDF Viewer", filename: "internal-pdf-viewer", description: "Portable Document Format" },
					{ name: "Chrome PDF Plugin", filename: "internal-pdf-viewer", description: "" }
				];
				return pluginList[index] || null;
			},
			namedItem: (name) => null,
			refresh: () => {},
			[Symbol.iterator]: function* () {
				for (let i = 0; i < this.length; i++) {
					yield this.item(i);
				}
			}
		};
	},
});

// Updated to current Safari version on macOS Sonoma
Object.defineProperty(navigator, "userAgent", {
	get: () =>
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
});

// Safari doesn't have userAgentData (it's a Chromium feature)
// So we leave it as the default undefined behavior

Object.defineProperty(navigator, "vendor", {
    get: () => "Apple Computer, Inc.",
});

// Consistent language for MacBook
Object.defineProperty(navigator, "languages", {
    get: () => ['en-US', 'en'],
});

Object.defineProperty(navigator, "language", {
    get: () => 'en-US',
});

// MacBook Air M1/M2 typically has 8 cores
Object.defineProperty(navigator, "hardwareConcurrency", {
    get: () => 8,
});


// Original getContext method
const originalGetContext = HTMLCanvasElement.prototype.getContext;

// Override getContext
HTMLCanvasElement.prototype.getContext = function(type, attributes) {
    // Call the original getContext method
    const context = originalGetContext.call(this, type, attributes);

    if (type.match(/webgl/i)) {
        const vendors = 'Apple Inc';
        // Override the WEBGL_debug_renderer_info if it's available
        if (context.getExtension('WEBGL_debug_renderer_info')) {
            const debugInfo = context.getExtension('WEBGL_debug_renderer_info');
            Object.defineProperty(context, 'getParameter', {
                value: function(parameter) {
                    if (parameter === debugInfo.UNMASKED_VENDOR_WEBGL) {
                        return vendors;
                    }
                    return context.getParameter(parameter);
                }
            });
        }
    }
    return context;
};

// MacBook Air typically has 8GB RAM
Object.defineProperty(navigator, "deviceMemory", {
	get: () => 8,
});

// Macs don't expose battery API in the same way - Safari blocks it for privacy
// Leave it as default behavior (undefined/blocked)

// Safari reports connection but with limited info
Object.defineProperty(navigator, "connection", {
	get: () => ({
		effectiveType: '4g',
		downlink: 10,
		rtt: 50,
		saveData: false
	}),
	configurable: true
});

// Don't override mediaDevices on Mac - let it work naturally for WebRTC

Object.defineProperty(navigator, "mimeTypes", {
	get: () => {
		const mimes = [
			{ type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" }
		];
		return {
			length: mimes.length,
			item: (index) => mimes[index] || null,
			namedItem: (name) => mimes.find(m => m.type === name) || null,
			[Symbol.iterator]: function* () {
				for (let i = 0; i < this.length; i++) {
					yield this.item(i);
				}
			}
		};
	},
});

// MacBook Air 13" has 2560x1600 native, but often scaled to 1440x900
Object.defineProperty(screen, "width", {
	get: () => 1440,
});

Object.defineProperty(screen, "height", {
	get: () => 900,
});

// Available height should account for macOS menu bar (subtract ~25-28px)
Object.defineProperty(screen, "availWidth", {
	get: () => 1440,
});

Object.defineProperty(screen, "availHeight", {
	get: () => 875,
});

Object.defineProperty(screen, "colorDepth", {
	get: () => 24,
});

Object.defineProperty(screen, "pixelDepth", {
	get: () => 24,
});

// Pacific Time Zone (PST/PDT: UTC-8 or UTC-7)
Object.defineProperty(Date.prototype, "getTimezoneOffset", {
	get: () => () => 420, // UTC-7 (PDT)
});

Object.defineProperty(Intl.DateTimeFormat.prototype, "resolvedOptions", {
	get: () => () => {
		return {
			locale: "en-US",
			calendar: "gregory",
			numberingSystem: "latn",
			timeZone: "America/Los_Angeles",
			year: "numeric",
			month: "numeric",
			day: "numeric",
		};
	},
});
