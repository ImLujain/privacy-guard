/* eslint-disable */
// Single static content script that loads the active profile.
// Registered in manifest at document_start. Reads selectedProfile from
// chrome.storage.local, then injects anti-detection.js + profileN.js
// into the main world via <script> tags.

(() => {
    function injectScript(scriptName) {
        const parent = document.documentElement;
        const script = document.createElement("script");
        script.src = chrome.runtime.getURL(scriptName);
        script.async = false;
        parent.insertBefore(script, parent.firstChild);
        parent.removeChild(script);
    }

    chrome.storage.local.get('selectedProfile', (data) => {
        const profile = data.selectedProfile || 'allProfiles';
        if (profile !== 'allProfiles') {
            injectScript("anti-detection.js");
            injectScript(profile + ".js");
        }
    });
})();
