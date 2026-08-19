/* eslint-disable @typescript-eslint/no-empty-function */
// Profile 2: MacBook — Safari 26 (validated 2026-04)

Object.defineProperty(navigator, "platform", {
	get: () => "MacIntel",
configurable: true,
});

// Safari 26 reports 5 plugins (validated via BrowserStack capture)
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
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15",
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

// Apple Silicon: 8 cores (always even — never 7, which Brave gets wrong)
Object.defineProperty(navigator, "hardwareConcurrency", {
    get: () => 8,
configurable: true,
});

// macOS: no touch
Object.defineProperty(navigator, "maxTouchPoints", {
	get: () => 0,
	configurable: true,
});

// Safari never exposes these — actively hide them
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

// Safari 26 reports 2 mimeTypes (validated)
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

// MacBook display: 1470x956 (common M-series resolution, validated)
Object.defineProperty(screen, "width", {
	get: () => 1470,
configurable: true,
});

Object.defineProperty(screen, "height", {
	get: () => 956,
configurable: true,
});

// macOS menu bar deducts ~25px (dock varies; using validated capture value)
Object.defineProperty(screen, "availWidth", {
	get: () => 1470,
configurable: true,
});

Object.defineProperty(screen, "availHeight", {
	get: () => 931,
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

// Pacific Time (UTC-7 PDT)
Object.defineProperty(Date.prototype, "getTimezoneOffset", {
	get: () => () => 420,
configurable: true,
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
configurable: true,
});
