/* eslint-disable @typescript-eslint/no-empty-function */
console.log("inside randomizing for profile3")
// Profile 3: iPhone - Realistic Mobile Safari configuration
Object.defineProperty(navigator, "platform", {
	get: () => "iPhone",
});

// iPhones report 0 plugins in Safari
Object.defineProperty(navigator, "plugins", {
	get: () => {
		return {
			length: 0,
			item: () => null,
			namedItem: () => null,
			refresh: () => {},
			[Symbol.iterator]: function* () {
				// Empty iterator for 0 length
			}
		};
	},
});

// Updated to current iOS version (iOS 17)
Object.defineProperty(navigator, "userAgent", {
	get: () =>
		"Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
});

// iOS Safari doesn't support userAgentData
// Leave as default

Object.defineProperty(navigator, "vendor", {
    get: () => "Apple Computer, Inc.",
});

// Consistent language for iPhone
Object.defineProperty(navigator, "languages", {
    get: () => ['en-US', 'en'],
});

Object.defineProperty(navigator, "language", {
    get: () => 'en-US',
});

// iPhone typically reports 6 cores (A15/A16 chips)
Object.defineProperty(navigator, "hardwareConcurrency", {
    get: () => 6,
});

// Original getContext method
const originalGetContext = HTMLCanvasElement.prototype.getContext;

// Override getContext
HTMLCanvasElement.prototype.getContext = function(type, attributes) {
    // Call the original getContext method
    const context = originalGetContext.call(this, type, attributes);

    if (type.match(/webgl/i)) {
        // Generate a random vendor string
        const vendors = 'Apple Inc'; // Example vendors
        

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


// iOS doesn't expose deviceMemory API
// Leave as default (undefined is correct for iOS)

// iOS doesn't expose battery API via navigator.getBattery
// Leave as default (undefined is correct for iOS)

// iOS has limited connection API
Object.defineProperty(navigator, "connection", {
	get: () => ({
		effectiveType: '4g',
		downlink: 10,
		rtt: 50,
		saveData: false
	}),
	configurable: true
});

// Don't override mediaDevices - iOS handles this with permissions

// iOS reports 0 mime types
Object.defineProperty(navigator, "mimeTypes", {
	get: () => {
		return {
			length: 0,
			item: () => null,
			namedItem: () => null,
			[Symbol.iterator]: function* () {
				// Empty iterator
			}
		};
	},
});



// iPhone 13/14 Pro dimensions (same as iPhone X which was in original)
Object.defineProperty(screen, "width", {
	get: () => 390,
});

Object.defineProperty(screen, "height", {
	get: () => 844,
});

// Mobile Safari on iOS: available screen matches full screen (no persistent nav bar deduction)
Object.defineProperty(screen, "availWidth", {
	get: () => 390,
});

Object.defineProperty(screen, "availHeight", {
	get: () => 844,
});

Object.defineProperty(screen, "colorDepth", {
	get: () => 24,
});

Object.defineProperty(screen, "pixelDepth", {
	get: () => 24,
});

// Central Time Zone (CST/CDT: UTC-6 or UTC-5)
Object.defineProperty(Date.prototype, "getTimezoneOffset", {
	get: () => () => 300, // UTC-5 (CDT)
});

Object.defineProperty(Intl.DateTimeFormat.prototype, "resolvedOptions", {
	get: () => () => {
		return {
			locale: "en-US",
			calendar: "gregory",
			numberingSystem: "latn",
			timeZone: "America/Chicago",
			year: "numeric",
			month: "numeric",
			day: "numeric",
		};
	},
});
