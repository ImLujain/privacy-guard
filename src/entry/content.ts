
import { createApp } from "vue"
import TrackerHandlerComponent from "../view/TrackerHandlerComponent.vue"



window.addEventListener("load", () => {

    //append app
    const contentDetectorWrapper = document.createElement("div")
    contentDetectorWrapper.id="tracker-wrapper-container"
    const htmlElement = document.querySelector("html");   
    htmlElement?.appendChild(contentDetectorWrapper)

    const contentDetectorHandlerApp = createApp(TrackerHandlerComponent)
    contentDetectorHandlerApp.mount("#tracker-wrapper-container") 

})

// const randomizeGeneralDataScript = document.createElement('script');
// randomizeGeneralDataScript.src = chrome.runtime.getURL('r.js');
// (document.head || document.documentElement).appendChild(randomizeGeneralDataScript);
// randomizeGeneralDataScript.remove()

const detectFBScript = document.createElement('script');
detectFBScript.src = chrome.runtime.getURL('PrivacyGuard-detect-fp-calls.js');
(document.head || document.documentElement).appendChild(detectFBScript);
detectFBScript.remove()




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLocalStorageDataForKey") {
        const value = localStorage.getItem(request.key);
        sendResponse({ data: value });
    }
    return true; // Return true to keep the message channel open
});

// Bridge: page-world FP detector posts batched access events on window;
// forward them to background which writes to chrome.storage.local.
window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const data: any = event.data;
    if (!data || data.__pgFp !== true) return;
    if (data.type === 'propertyAccess' && Array.isArray(data.events)) {
        try {
            chrome.runtime.sendMessage({ action: 'logPropertyAccess', events: data.events });
        } catch (e) {
            // Extension context can be invalidated on update; drop the batch.
        }
    }
});

// Page-load timing capture: addresses the performance-overhead claim in the paper.
// Runs in isolated world so chrome.runtime is available directly.
(() => {
    const pageOrigin = window.location.origin;
    const domain = window.location.hostname;
    if (!domain) return;

    function countScripts() {
        const scripts = document.scripts;
        let third = 0;
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (!src) continue;
            try {
                if (new URL(src).origin !== pageOrigin) third++;
            } catch (_) { /* relative / data: URL */ }
        }
        return { total: scripts.length, third };
    }

    function reportTiming() {
        let domContentLoadedMs = -1;
        let loadEventMs = -1;
        try {
            const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
            if (nav) {
                domContentLoadedMs = Math.round(nav.domContentLoadedEventEnd - nav.startTime);
                loadEventMs = Math.round(nav.loadEventEnd - nav.startTime);
            }
        } catch (_) { /* PerformanceNavigationTiming unsupported */ }

        const counts = countScripts();
        const timing = {
            domain,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            domContentLoadedMs,
            loadEventMs,
            scriptCount: counts.total,
            thirdPartyScriptCount: counts.third
        };
        try {
            chrome.runtime.sendMessage({ action: 'logPageLoadTiming', timing });
        } catch (_) { /* extension reload */ }
    }

    if (document.readyState === 'complete') {
        // Page already loaded by the time we attached — capture immediately.
        setTimeout(reportTiming, 0);
    } else {
        window.addEventListener('load', () => {
            // Defer one frame so loadEventEnd is finalized in the timing entry.
            setTimeout(reportTiming, 0);
        });
    }
})();