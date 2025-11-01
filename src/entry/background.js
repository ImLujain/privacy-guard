const DISCONNECT_URL = 'https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/services.json';

let disconnectList = {}; // Create list to store the retrieved list
let currentProfile = 'allProfiles'; // Default profile

const userAgents = {
    'profile1': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 ',
    'profile2': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15',
    'profile3': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
};

// const profileScripts = {
//     'profile1': 'profile1.js',
//     'profile2': 'profile2.js',
//     //'profile3': 'profile3.js',
// };

async function getCurrentTabId() {
    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    return tab.id;
}

async function reload() {
    const tabId = await getCurrentTabId();
   //chrome.tabs.reload(tabId, { bypassCache: true });
}

function registerProfile1Script(currentProfile) {
    c =  currentProfile == "profile1"
    const id = "inject_script_profile1";
    if (c) {
        console.log("inside inject script ")

        chrome.scripting.registerContentScripts(
            [
                {
                    id,
                    matches: ["<all_urls>"],
                    allFrames: true,
                    runAt: "document_start",
                    js: ["profile1_content.js"],
                },
            ],
            () => {
                reload();
            }
        );
    } else {
        chrome.scripting.unregisterContentScripts({ ids: [id] }, () => {
            reload();
        });
    }
}

function registerProfile2Script(currentProfile) {
        c =  currentProfile == "profile2"
		const id = "inject_script_profile2";
		if (c) {
            console.log("inside inject script ")

			chrome.scripting.registerContentScripts(
				[
					{
						id,
						matches: ["<all_urls>"],
						allFrames: true,
						runAt: "document_start",
						js: ["profile2_content.js"],
					},
				],
				() => {
					reload();
				}
			);
		} else {
			chrome.scripting.unregisterContentScripts({ ids: [id] }, () => {
				reload();
			});
		}
}

function registerProfile3Script(currentProfile) {
    c =  currentProfile == "profile3"
    const id = "inject_script_profile3";
    if (c) {
        console.log("inside inject script ")

        chrome.scripting.registerContentScripts(
            [
                {
                    id,
                    matches: ["<all_urls>"],
                    allFrames: true,
                    runAt: "document_start",
                    js: ["profile3_content.js"],
                },
            ],
            () => {
                reload();
            }
        );
    } else {
        chrome.scripting.unregisterContentScripts({ ids: [id] }, () => {
            reload();
        });
    }
}

chrome.storage.local.get(['selectedProfile'], (data) => {
    if (data.selectedProfile) {
        currentProfile = data.selectedProfile;
    }
    if (currentProfile != "profile2"){
        registerProfile1Script(currentProfile);
        registerProfile2Script(currentProfile);
        registerProfile3Script(currentProfile);

    }
});

chrome.storage.onChanged.addListener(function(changes) {
    if (changes.selectedProfile) {
        currentProfile = changes.selectedProfile.newValue;

        if(currentProfile !== 'allProfiles') {
            registerProfile1Script(currentProfile);
            registerProfile2Script(currentProfile);
            registerProfile3Script(currentProfile);

            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: [{
                    "id": 1,
                    "priority": 1,
                    "action": {
                        "type": "modifyHeaders",
                        "requestHeaders": [{
                            "header": "User-Agent",
                            "operation": "set",
                            "value": userAgents[currentProfile]
                        }]
                    },
                    "condition": {
                        "urlFilter": "|http*",
                        "resourceTypes": ["script", "main_frame", "sub_frame"]
                    }
                }],
                removeRuleIds: [1]
            });
        } else {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [1]
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error(`Error removing rules: ${chrome.runtime.lastError}`);
                } else {
                    console.log("Rule to modify user agent removed successfully.");
                }
            });
        }
    }
});

async function fetchDisconnectList() {
    try {
        const response = await fetch(DISCONNECT_URL);
        disconnectList = await response.json();
        console.log("Fetched Disconnect.me list:", disconnectList);
    } catch (error) {
        console.error('Error fetching Disconnect.me list:', error);
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

        for (const category in disconnectList.categories) {
            const services = disconnectList.categories[category];
            for (const serviceObj of services) {
                for (const serviceName of Object.keys(serviceObj)) {
                    const serviceDomains = Object.values(serviceObj[serviceName]).flat();
                    if (serviceDomains.includes(domain)) {
                        const timestamp = new Date().toISOString();
                        const trackerInfo = {
                            trackerDomain: domain,
                            timestamp,
                            parentDomain,
                            category
                        };
                        storeDetectedTracker(trackerInfo);
                    }
                }
            }
        }
    },
    { urls: ["<all_urls>"] }
);

function storeDetectedTracker(trackerInfo) {
    chrome.storage.local.get(['selectedProfile', 'detectedTrackers', 'uniqueTrackersCount', 'uniqueDomainsCount'], (data) => {
        const profile = data.selectedProfile || 'profile1';
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

        chrome.storage.local.set({
            detectedTrackers: trackers,
            uniqueTrackersCount: uniqueTrackersCount,
            uniqueDomainsCount: uniqueDomainsCount
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "getTrackers") {
            const profile = request.profile;
            chrome.storage.local.get(['detectedTrackers', 'uniqueTrackersCount', 'uniqueDomainsCount'], (data) => {
                const trackers = data.detectedTrackers || {};
                const uniqueTrackersCount = data.uniqueTrackersCount || 0;
                const uniqueDomainsCount = data.uniqueDomainsCount || 0;
                console.log("Sending data to popup:", data);
                sendResponse({
                    trackers: trackers,
                    uniqueTrackersCount: uniqueTrackersCount,
                    uniqueDomainsCount: uniqueDomainsCount
                });
            });
            return true;
        }
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
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
    }
);

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         if (request.greeting === "hello") {
//             sendResponse({farewell: "goodbye"});
//         }
//         return true;
//     }
// );

function getAccessData() {
    return accessData;
}

fetchDisconnectList();
