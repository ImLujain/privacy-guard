/* eslint-disable @typescript-eslint/no-empty-function */
// Profile 4: Windows Desktop — Edge 147 (validated 2026-04)

Object.defineProperty(navigator, "platform", {
	get: () => "Win32",
configurable: true,
});

Object.defineProperty(navigator, "plugins", {
	get: () => {
		return {
			length: 5,
			item: (index) => {
				const pluginList = [
					{ name: "PDF Viewer", filename: "internal-pdf-viewer" },
					{ name: "Chrome PDF Viewer", filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai" },
					{ name: "Chromium PDF Viewer", filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai" },
					{ name: "Microsoft Edge PDF Viewer", filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai" },
					{ name: "WebKit built-in PDF", filename: "internal-pdf-viewer" }
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
	configurable: true,
});

Object.defineProperty(navigator, "userAgent", {
	get: () =>
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0",
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

// 16 cores — high-end desktop (validated from Edge capture)
Object.defineProperty(navigator, "hardwareConcurrency", {
    get: () => 16,
configurable: true,
});

// Desktop: no touch
Object.defineProperty(navigator, "maxTouchPoints", {
	get: () => 0,
	configurable: true,
});

// Edge 147 disabled these APIs — actively hide them
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

// 2560x1440 QHD monitor
Object.defineProperty(screen, "width", {
	get: () => 2560,
configurable: true,
});

Object.defineProperty(screen, "height", {
	get: () => 1440,
configurable: true,
});

// Windows taskbar ~40px
Object.defineProperty(screen, "availWidth", {
	get: () => 2560,
configurable: true,
});

Object.defineProperty(screen, "availHeight", {
	get: () => 1400,
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
