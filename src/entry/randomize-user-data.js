console.log("testtt");

// Profiles with specific attributes
const profiles = {
    profile1: {
        screen: { width: 1920, height: 1080 }, // Example dimensions for a Windows machine
        batteryLevel: 0.7, // 70%
        name: "Windows Desktop",
    },
    profile2: {
        screen: { width: 1440, height: 900 }, // Example dimensions for a MacBook
        batteryLevel: 0.5, // 50%
        name:  "MacBook Air",
    },
    profile3: {
        screen: { width: 375, height: 812 }, // Example dimensions for an iPhone
        batteryLevel: 0.8, // 80%
        name: "iPhone X,"

    }
};

function applyProfileAttributes(profileData) {
    // Apply user agent, screen dimensions, and battery level based on the profile
    console.log(`Applying settings for: ${profileData}`);
    
    // Assuming these functions are adjusted to use profile-specific data
    randomizeBatteryLevel(profileData.batteryLevel);
    //randomizeScreenResolution(profileData.screen.width, profileData.screen.height);
}

// This function now receives the profile data instead of a boolean
function toggleRandomization(isRandomizationEnabled, profile) {
    console.log('profile inside toggle :', profile)
    if (isRandomizationEnabled) {
        console.log(`${profile} randomization enabled`);
        applyProfileAttributes(profiles[profile]);
    } else {
        console.log("Randomization disabled");
        // Optionally reset to default values or handle "allProfiles" case
    }
}

// Adjusted to select specific profiles
// In yourContentScript.js
// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//     console.log(response.farewell);
//   });

// Check the selected profile to determine if randomization should be enabled
chrome.storage.local.get('selectedProfile', function(data) {
    const isRandomizationEnabled = data.selectedProfile !== 'allProfiles';
    console.log('profile :', data.selectedProfile)
    toggleRandomization(isRandomizationEnabled, data.selectedProfile);
});

// Randomize battery level

function randomizeBatteryLevel(battrylevel) {
    const randomBatteryLevel = battrylevel
    console.log("Battery level randomized", randomBatteryLevel);

    const scriptContent = `
        if (navigator.getBattery) {
            const originalGetBattery = navigator.getBattery.bind(navigator);

            navigator.getBattery = function() {
                return originalGetBattery().then(battery => {
                    const newBattery = Object.create(battery);
                    Object.defineProperty(newBattery, 'level', {
                        get: function() {
                            return ${randomBatteryLevel};
                        },
                        enumerable: true,
                        configurable: true
                    });
                    return newBattery;
                });
            };
        }
    `;

    //injectScript(scriptContent);
    const scriptElement = document.createElement('script');
    scriptElement.textContent = scriptContent;
    (document.head || document.documentElement).appendChild(scriptElement);
    scriptElement.remove();
    console.log("Battery level randomized", randomBatteryLevel);
}


// Randomize screen resolution
function randomizeScreenResolution(dimenw, dimenh) {

        const randomWidth = dimenw ; // Math.floor(Math.random() * 500) + 1024; // Random width between 1024 and 1523
        const randomHeight = dimenh; //Math.floor(Math.random() * 300) + 768; // Random height between 768 and 1067

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
    
}
