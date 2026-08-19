/* eslint-disable @typescript-eslint/no-empty-function */
// Profile 3: iPhone — Safari 26 (validated 2026-04)

Object.defineProperty(navigator, "platform", {
	get: () => "iPhone",
configurable: true,
});

// Safari 26 on iOS reports 5 plugins (validated — changed from 0 in older versions)
Object.defineProperty(navigator, "plugins", {
	get: () => {
		return {
			length: 5,
			item: (index) => {
				const pluginList = [
					{ name: "PDF Viewer", filename: "internal-pdf-viewer", description: "Portable Document Format" },
					{ name: "Chrome PDF Viewer", filename: "internal-pdf-viewer", description: "" },
					{ name: "Chromium PDF Viewer", filename: "internal-pdf-viewer", description: "" },
					{ name: "Microsoft Edge PDF Viewer", filename: "internal-pdf-viewer", description: "" },
					{ name: "WebKit built-in PDF", filename: "internal-pdf-viewer", description: "" }
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

Object.defineProperty(navigator, "userAgent", {
	get: () =>
		"Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
configurable: true,
});

Object.defineProperty(navigator, "vendor", {
    get: () => "Apple Computer, Inc.",
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

// A-series chip: 6 cores (even number — never odd like Brave's 7)
Object.defineProperty(navigator, "hardwareConcurrency", {
    get: () => 6,
configurable: true,
});

// iPhone: touch-capable device
Object.defineProperty(navigator, "maxTouchPoints", {
	get: () => 5,
	configurable: true,
});

// iOS Safari never exposes these — actively hide them
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
if (navigator.connection) {
	Object.defineProperty(navigator, "connection", {
		get: () => undefined,
		configurable: true,
	});
}
// Safari doesn't have performance.memory (Chromium-only)
try {
	Object.defineProperty(performance, "memory", {
		get: () => undefined,
		configurable: true,
	});
} catch (e) { /* non-configurable on some builds — best effort */ }

// Safari 26 on iOS reports 2 mimeTypes (validated — changed from 0)
Object.defineProperty(navigator, "mimeTypes", {
	get: () => {
		const mimes = [
			{ type: "application/pdf", suffixes: "pdf", description: "Portable Document Format" },
			{ type: "text/pdf", suffixes: "pdf", description: "Portable Document Format" }
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
configurable: true,
});

// iPhone 11 / XR dimensions (414x896, validated)
Object.defineProperty(screen, "width", {
	get: () => 414,
configurable: true,
});

Object.defineProperty(screen, "height", {
	get: () => 896,
configurable: true,
});

// iOS: available screen matches full screen (no persistent nav bar)
Object.defineProperty(screen, "availWidth", {
	get: () => 414,
configurable: true,
});

Object.defineProperty(screen, "availHeight", {
	get: () => 896,
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

// Central Time (UTC-5 CDT)
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
			timeZone: "America/Chicago",
			year: "numeric",
			month: "numeric",
			day: "numeric",
		};
	},
configurable: true,
});
