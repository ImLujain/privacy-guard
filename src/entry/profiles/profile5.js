/* eslint-disable @typescript-eslint/no-empty-function */
// Profile 5: Android — Chrome 145 (validated 2026-04)

Object.defineProperty(navigator, "platform", {
	get: () => "Linux armv81",
configurable: true,
});

// Android Chrome reports 0 plugins (validated)
Object.defineProperty(navigator, "plugins", {
	get: () => {
		return {
			length: 0,
			item: () => null,
			namedItem: () => null,
			refresh: () => {},
			[Symbol.iterator]: function* () {}
		};
	},
configurable: true,
});

Object.defineProperty(navigator, "userAgent", {
	get: () =>
		"Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36",
configurable: true,
});

Object.defineProperty(navigator, "vendor", {
    get: () => "Google Inc.",
configurable: true,
});

Object.defineProperty(navigator, "languages", {
    get: () => ['en-US', 'en'],
configurable: true,
});

Object.defineProperty(navigator, "language", {
    get: () => 'en-US',
configurable: true,
});

// Snapdragon 8 Gen 2: 8 cores (even, realistic)
Object.defineProperty(navigator, "hardwareConcurrency", {
    get: () => 8,
configurable: true,
});

// Android: touch-capable device
Object.defineProperty(navigator, "maxTouchPoints", {
	get: () => 5,
	configurable: true,
});

// Android Chrome 145 did not expose these — actively hide them
Object.defineProperty(navigator, "deviceMemory", {
	get: () => undefined,
	configurable: true,
});
if (navigator.getBattery) {
	Object.defineProperty(navigator, "getBattery", {
		get: () => undefined,
		configurable: true,
	});
}
if (navigator.userAgentData) {
	Object.defineProperty(navigator, "userAgentData", {
		get: () => undefined,
		configurable: true,
	});
}

// Android Chrome reports 0 mimeTypes (validated)
Object.defineProperty(navigator, "mimeTypes", {
	get: () => {
		return {
			length: 0,
			item: () => null,
			namedItem: () => null,
			[Symbol.iterator]: function* () {}
		};
	},
configurable: true,
});

// Android connection is exposed
Object.defineProperty(navigator, "connection", {
	get: () => ({
		effectiveType: '4g',
		downlink: 10,
		rtt: 50,
		saveData: false
	}),
	configurable: true
});

// Pixel 7 dimensions (412x906, validated)
Object.defineProperty(screen, "width", {
	get: () => 412,
configurable: true,
});

Object.defineProperty(screen, "height", {
	get: () => 906,
configurable: true,
});

// Android status bar + nav bar ~48px
Object.defineProperty(screen, "availWidth", {
	get: () => 412,
configurable: true,
});

Object.defineProperty(screen, "availHeight", {
	get: () => 858,
configurable: true,
});

Object.defineProperty(screen, "colorDepth", {
	get: () => 24,
configurable: true,
});

Object.defineProperty(screen, "pixelDepth", {
	get: () => 24,
configurable: true,
});

// Eastern Time (UTC-5)
Object.defineProperty(Date.prototype, "getTimezoneOffset", {
	get: () => () => 300,
configurable: true,
});

Object.defineProperty(Intl.DateTimeFormat.prototype, "resolvedOptions", {
	get: () => () => {
		return {
			locale: "en-US",
			calendar: "gregory",
			numberingSystem: "latn",
			timeZone: "America/New_York",
			year: "numeric",
			month: "numeric",
			day: "numeric",
		};
	},
configurable: true,
});
