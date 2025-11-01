/* eslint-disable */
console.log("inside 2 content");
(() => {
	function injectScript(scriptName) {
		const parent = document.documentElement;
		const script = document.createElement("script");
		script.src = chrome.runtime.getURL(scriptName);
		script.async = false;
		parent.insertBefore(script, parent.firstChild);
		parent.removeChild(script);
	}

	// Load anti-detection script first, then profile
	injectScript("anti-detection.js");
	injectScript("profile2.js");
})();