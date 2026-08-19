const DISCONNECT_URL = 'https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/services.json';

let disconnectList = {};
let currentProfile = 'allProfiles';
let experimentMode = 'mitigation-on'; // 'off' | 'monitor-only' | 'mitigation-on'

const UA_RULE_ID = 1;

function applyUARule(profile) {
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
            "id": UA_RULE_ID,
            "priority": 1,
            "action": {
                "type": "modifyHeaders",
                "requestHeaders": [{
                    "header": "User-Agent",
                    "operation": "set",
                    "value": userAgents[profile]
                }]
            },
            "condition": {
                "urlFilter": "|http*",
                "resourceTypes": ["script", "main_frame", "sub_frame"]
            }
        }],
        removeRuleIds: [UA_RULE_ID]
    });
}

function clearUARule() {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [UA_RULE_ID]
    });
}

async function applyMitigation(profile) {
    if (profile !== 'allProfiles' && PROFILE_IDS.includes(profile)) {
        await activateProfile(profile);
        applyUARule(profile);
    } else {
        await activateProfile('allProfiles');
        clearUARule();
    }
}

async function clearMitigation() {
    await activateProfile('allProfiles'); // unregisters profile scripts
    clearUARule();
}

// Updated UA strings matching each profile's validated 2026 values
const userAgents = {
    'profile1': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
    'profile2': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15',
    'profile3': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
    'profile4': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0',
    'profile5': 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36',
};

const PROFILE_IDS = ['profile1', 'profile2', 'profile3', 'profile4', 'profile5'];

async function getCurrentTabId() {
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    return tab ? tab.id : null;
}

async function reload() {
    const tabId = await getCurrentTabId();
    if (tabId) {
        chrome.tabs.reload(tabId, { bypassCache: true });
    }
}

// Profile injection: register anti-detection.js + profileN.js as MAIN-world
// content scripts via chrome.scripting.registerContentScripts. The MAIN world
// means they run in the page's JS context (not the extension's isolated world),
// so Object.defineProperty overrides take effect on navigator/screen directly.
async function activateProfile(activeProfile) {
    // Unregister any previously registered profile scripts
    try {
        await chrome.scripting.unregisterContentScripts({
            ids: ['pg_anti_detection', 'pg_profile']
        });
    } catch (e) {
        // Not registered yet — fine
    }

    // Register the active profile in the MAIN world
    if (activeProfile !== 'allProfiles' && PROFILE_IDS.includes(activeProfile)) {
        try {
            // IMPORTANT: profile script runs FIRST to set navigator.platform,
            // then anti-detection reads the spoofed platform to apply
            // platform-specific protections (touch, WebGL, perf.memory).
            await chrome.scripting.registerContentScripts([
                {
                    id: 'pg_profile',
                    matches: ['<all_urls>'],
                    allFrames: true,
                    runAt: 'document_start',
                    js: [activeProfile + '.js'],
                    world: 'MAIN',
                },
                {
                    id: 'pg_anti_detection',
                    matches: ['<all_urls>'],
                    allFrames: true,
                    runAt: 'document_start',
                    js: ['anti-detection.js'],
                    world: 'MAIN',
                },
            ]);
        } catch (e) {
            console.error('Failed to register profile:', e);
        }
    }
}

// Cold start: load selected profile + experiment mode
chrome.storage.local.get(['selectedProfile', 'experimentMode'], async (data) => {
    if (data.selectedProfile) {
        currentProfile = data.selectedProfile;
    }
    experimentMode = data.experimentMode || 'mitigation-on';
    // Persist default so consumers can read it without falling back
    if (!data.experimentMode) {
        chrome.storage.local.set({ experimentMode: 'mitigation-on' });
    }
    if (experimentMode === 'mitigation-on') {
        await applyMitigation(currentProfile);
    } else {
        await clearMitigation();
    }
});

// Profile + experiment-mode switch listener
chrome.storage.onChanged.addListener(async function(changes) {
    if (changes.experimentMode) {
        experimentMode = changes.experimentMode.newValue || 'mitigation-on';
        if (experimentMode === 'mitigation-on') {
            await applyMitigation(currentProfile);
        } else {
            // 'off' and 'monitor-only' both turn off active mitigation.
            // onBeforeRequest tracker logging keeps running regardless.
            await clearMitigation();
        }
    }

    if (changes.selectedProfile) {
        currentProfile = changes.selectedProfile.newValue;
        if (experimentMode === 'mitigation-on') {
            await applyMitigation(currentProfile);
        }
    }
});

// Tracker detection via Disconnect.me list
async function fetchDisconnectList() {
    // Load the last cached copy first so tracker matching works from the first
    // request after a service-worker cold start, then refresh from the network.
    // Without this, a failed or slow startup fetch leaves the list empty and
    // tracker events are silently dropped until the worker restarts.
    try {
        const cached = await chrome.storage.local.get('pg_disconnect_cache');
        if (cached.pg_disconnect_cache) disconnectList = cached.pg_disconnect_cache;
    } catch (e) { /* cache miss is fine */ }
    try {
        const response = await fetch(DISCONNECT_URL);
        disconnectList = await response.json();
        chrome.storage.local.set({ pg_disconnect_cache: disconnectList });
    } catch (error) {
        console.error('Error fetching Disconnect.me list:', error);
        if (!disconnectList || !disconnectList.categories) {
            setTimeout(fetchDisconnectList, 30000); // retry until a list is available
        }
    }
}

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (!details.url) return;

        const domain = new URL(details.url).hostname;
        let parentDomain = null;
        if (details.initiator) {
            parentDomain = new URL(details.initiator).hostname;
        } else if (details.documentUrl) {
            parentDomain = new URL(details.documentUrl).hostname;
        } else {
            parentDomain = domain;
        }

        // Match the request host against the Disconnect list by registrable-domain
        // suffix, not exact equality: a tracker listed as "doubleclick.net" must
        // also catch "stats.g.doubleclick.net". Stop at the first matching service
        // so each request is recorded once with its category.
        let matchedCategory = null;
        outer:
        for (const category in disconnectList.categories) {
            for (const serviceObj of disconnectList.categories[category]) {
                for (const serviceName of Object.keys(serviceObj)) {
                    const serviceDomains = Object.values(serviceObj[serviceName]).flat();
                    if (serviceDomains.some((d) => domain === d || domain.endsWith('.' + d))) {
                        matchedCategory = category;
                        break outer;
                    }
                }
            }
        }
        if (matchedCategory) {
            storeDetectedTracker({
                trackerDomain: domain,
                timestamp: new Date().toISOString(),
                parentDomain,
                category: matchedCategory
            });
        }
    },
    { urls: ["<all_urls>"] }
);

function storeDetectedTracker(trackerInfo) {
    chrome.storage.local.get(['selectedProfile', 'experimentMode', 'detectedTrackers', 'uniqueTrackersCount', 'uniqueDomainsCount', 'trackerEvents'], (data) => {
        const profile = data.selectedProfile || 'profile1';
        const mode = data.experimentMode || 'mitigation-on';
        const trackers = data.detectedTrackers || {};
        let uniqueTrackersCount = data.uniqueTrackersCount || 0;
        let uniqueDomainsCount = data.uniqueDomainsCount || 0;
        trackers[profile] = trackers[profile] || [];

        const isDuplicateTracker = trackers[profile].some((entry) =>
            entry.trackerDomain === trackerInfo.trackerDomain
        );

        const isDuplicateParentDomain = trackers[profile].some((entry) =>
            entry.parentDomain === trackerInfo.parentDomain
        );

        if (!isDuplicateTracker) {
            trackers[profile].push(trackerInfo);
            uniqueTrackersCount++;
        }

        if (!isDuplicateParentDomain && trackerInfo.parentDomain !== trackerInfo.trackerDomain) {
            uniqueDomainsCount++;
        }

        // Event-level log for export (paired-analysis friendly: every detection,
        // not deduped, with mode + profile snapshot inlined).
        const events = data.trackerEvents || [];
        events.push({
            ...trackerInfo,
            experimentMode: mode,
            profile,
            firstOrThirdParty: trackerInfo.parentDomain && trackerInfo.parentDomain !== trackerInfo.trackerDomain
                ? 'third-party'
                : 'first-party'
        });

        chrome.storage.local.set({
            detectedTrackers: trackers,
            uniqueTrackersCount: uniqueTrackersCount,
            uniqueDomainsCount: uniqueDomainsCount,
            trackerEvents: events
        });
    });
}

// Message handlers
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "getTrackers") {
            chrome.storage.local.get(['detectedTrackers', 'uniqueTrackersCount', 'uniqueDomainsCount'], (data) => {
                sendResponse({
                    trackers: data.detectedTrackers || {},
                    uniqueTrackersCount: data.uniqueTrackersCount || 0,
                    uniqueDomainsCount: data.uniqueDomainsCount || 0
                });
            });
            return true;
        }

        if (request.action === "getSelectedProfile") {
            chrome.storage.local.get('selectedProfile', function(data) {
                if (chrome.runtime.lastError) {
                    sendResponse({error: chrome.runtime.lastError.message});
                } else {
                    sendResponse({selectedProfile: data.selectedProfile});
                }
            });
            return true;
        }

        // Page-world FP-monitor forwards a batch of access events here via the
        // isolated-world content script. We snapshot experimentMode + profile
        // at write time so paired analysis works after export.
        if (request.action === "logPropertyAccess") {
            const batch = Array.isArray(request.events) ? request.events : [];
            if (batch.length === 0) {
                sendResponse({ ok: true, written: 0 });
                return true;
            }
            chrome.storage.local.get(
                ['propertyAccessEvents', 'experimentMode', 'selectedProfile'],
                (data) => {
                    const events = data.propertyAccessEvents || [];
                    const mode = data.experimentMode || 'mitigation-on';
                    const profile = data.selectedProfile || 'allProfiles';
                    for (const ev of batch) {
                        events.push({
                            domain: ev.domain,
                            property: ev.property,
                            isThirdParty: !!ev.isThirdParty,
                            timestamp: ev.timestamp,
                            experimentMode: mode,
                            profile
                        });
                    }
                    chrome.storage.local.set({ propertyAccessEvents: events }, () => {
                        sendResponse({ ok: true, written: batch.length });
                    });
                }
            );
            return true;
        }

        // Popup uses this to render the existing "accessed properties" list
        // for the current tab — we re-derive {property, isThirdParty[]} from
        // the central event log so we don't depend on per-site localStorage.
        if (request.action === "getPropertyAccessForDomain") {
            chrome.storage.local.get('propertyAccessEvents', (data) => {
                const all = data.propertyAccessEvents || [];
                const byProp = new Map();
                for (const ev of all) {
                    if (ev.domain !== request.domain) continue;
                    if (!byProp.has(ev.property)) {
                        byProp.set(ev.property, new Set());
                    }
                    byProp.get(ev.property).add(!!ev.isThirdParty);
                }
                const list = [];
                for (const [property, tpSet] of byProp.entries()) {
                    list.push({ property, isThirdParty: Array.from(tpSet) });
                }
                sendResponse({ data: list });
            });
            return true;
        }

        if (request.action === "logPageLoadTiming") {
            chrome.storage.local.get(
                ['pageLoadTimings', 'experimentMode', 'selectedProfile'],
                (data) => {
                    const timings = data.pageLoadTimings || [];
                    timings.push({
                        ...request.timing,
                        experimentMode: data.experimentMode || 'mitigation-on',
                        profile: data.selectedProfile || 'allProfiles'
                    });
                    chrome.storage.local.set({ pageLoadTimings: timings }, () => {
                        sendResponse({ ok: true });
                    });
                }
            );
            return true;
        }

        if (request.action === "getAllExportData") {
            chrome.storage.local.get(
                ['trackerEvents', 'propertyAccessEvents', 'pageLoadTimings'],
                (data) => {
                    sendResponse({
                        trackers: data.trackerEvents || [],
                        propertyAccess: data.propertyAccessEvents || [],
                        pageLoadTimings: data.pageLoadTimings || []
                    });
                }
            );
            return true;
        }

        // Ollama proxy (bypass CORS)
        if (request.action === "ollamaRequest") {
            const url = request.url;
            const options = {
                method: request.method || 'GET',
                headers: request.headers || {},
            };

            if (request.body) {
                options.body = JSON.stringify(request.body);
            }

            if (request.timeout) {
                const controller = new AbortController();
                options.signal = controller.signal;
                setTimeout(() => controller.abort(), request.timeout);
            }

            fetch(url, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    sendResponse({ success: true, data: data });
                })
                .catch(error => {
                    sendResponse({ success: false, error: error.message });
                });

            return true;
        }
    }
);

fetchDisconnectList();
