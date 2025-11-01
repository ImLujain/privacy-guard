console.log("Content script is loading");

document.addEventListener('DOMContentLoaded', function() {
    initializeContentScript();
});


function initializeContentScript() {
let shouldRandomize = false; // Default to no randomization

// Listener for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "setRandomization") {
        shouldRandomize = request.randomize;
        applyRandomization();
    }
});

function applyRandomization() {
    if (shouldRandomize) {
        // Randomize battery level
        if (navigator.getBattery) {
            const randomBatteryLevel = Math.random();
            const originalGetBattery = navigator.getBattery.bind(navigator);

            navigator.getBattery = function() {
                return originalGetBattery().then(battery => {
                    const newBattery = Object.create(battery);
                    Object.defineProperty(newBattery, 'level', {
                        get: function() {
                            return randomBatteryLevel;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return newBattery;
                });
            };

            console.log("Battery level randomized", randomBatteryLevel);
        }

        // Randomize screen resolution
        const randomWidth = Math.floor(Math.random() * 500) + 1024; // Random width between 1024 and 1523
        const randomHeight = Math.floor(Math.random() * 300) + 768; // Random height between 768 and 1067

        Object.defineProperty(window.screen, 'width', {
            get: function() {
                return randomWidth;
            },
            configurable: true
        });

        Object.defineProperty(window.screen, 'height', {
            get: function() {
                return randomHeight;
            },
            configurable: true
        });

        console.log(`Screen dimensions randomized to: ${randomWidth}x${randomHeight}`);
    } else {
        // Restore default behavior or do nothing if randomization is not needed
        console.log("No randomization applied");
    }
}

// Initial call to apply randomization based on the default state
applyRandomization();

}
