/* eslint-disable */
(() => {
	function injectScript(scriptName) {
		const parent = document.documentElement;
		const script = document.createElement("script");
		script.src = chrome.runtime.getURL(scriptName);
		script.async = false;
		parent.insertBefore(script, parent.firstChild);
		parent.removeChild(script);
	}

	injectScript("anti-detection.js");
	injectScript("profile4.js");
})();
