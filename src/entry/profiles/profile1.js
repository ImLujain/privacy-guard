/* eslint-disable @typescript-eslint/no-empty-function */
// Profile 1: Windows Desktop - Realistic configuration
Object.defineProperty(navigator, "platform", {
	get: () => "Win32",
});

// Realistic plugin configuration for Chrome on Windows
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
});

Object.defineProperty(navigator, "userAgent", {
	get: () =>
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
});

Object.defineProperty(navigator, "vendor", {
    get: () => "Google Inc.",
});

// Consistent language preference (doesn't change per page)
Object.defineProperty(navigator, "languages", {
    get: () => ['en-US', 'en'],
});

Object.defineProperty(navigator, "language", {
    get: () => 'en-US',
});

// Realistic hardware concurrency (8 cores is common)
Object.defineProperty(navigator, "hardwareConcurrency", {
    get: () => 8,
});

// Real devices report memory in GB: 2, 4, 8, 16
Object.defineProperty(navigator, "deviceMemory", {
	get: () => 8,
});

// Realistic battery API that returns a promise
if (navigator.getBattery) {
	const originalGetBattery = navigator.getBattery.bind(navigator);
	Object.defineProperty(navigator, "getBattery", {
		get: () => () => {
			return originalGetBattery().then(battery => {
				return {
					charging: true,
					chargingTime: 0,
					dischargingTime: Infinity,
					level: 1.0,
					onchargingchange: null,
					onchargingtimechange: null,
					ondischargingtimechange: null,
					onlevelchange: null,
					addEventListener: battery.addEventListener.bind(battery),
					removeEventListener: battery.removeEventListener.bind(battery),
					dispatchEvent: battery.dispatchEvent.bind(battery)
				};
			});
		},
	});
}

// Realistic connection info (4g is most common)
Object.defineProperty(navigator, "connection", {
	get: () => ({
		effectiveType: '4g',
		downlink: 10,
		rtt: 50,
		saveData: false
	}),
	configurable: true
});

// Don't override mediaDevices - let it work naturally
// Removing the override allows WebRTC to function properly

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
});




// Realistic screen dimensions for 1080p monitor
Object.defineProperty(screen, "width", {
	get: () => 1920,
});

Object.defineProperty(screen, "height", {
	get: () => 1080,
});

// Available screen should account for taskbar (subtract ~40px for Windows taskbar)
Object.defineProperty(screen, "availWidth", {
	get: () => 1920,
});

Object.defineProperty(screen, "availHeight", {
	get: () => 1040,
});

Object.defineProperty(screen, "colorDepth", {
	get: () => 24,
});

Object.defineProperty(screen, "pixelDepth", {
	get: () => 24,
});

// Use a realistic timezone offset (EST/EDT: UTC-5 or UTC-4)
// -300 minutes = UTC-5 (Eastern Time)
Object.defineProperty(Date.prototype, "getTimezoneOffset", {
	get: () => () => -300,
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
});
