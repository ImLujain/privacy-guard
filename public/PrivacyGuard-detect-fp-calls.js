console.log("hii")
//list of properties to monitor for device info access
const deviceInfoProperties = [
    // Navigator Object
    //"navigator.userAgent",
    "navigator.appVersion",
    "navigator.platform",
    "navigator.vendor",
    "navigator.languages",
    "navigator.deviceMemory",
    "navigator.hardwareConcurrency",
    "navigator.maxTouchPoints",
    "navigator.onLine",
    "navigator.doNotTrack",
    "navigator.geolocation",
    "navigator.mimeTypes",
    "navigator.plugins",
    "navigator.getBattery",
    "navigator.connection",
    "navigator.permissions",
    
    // Screen Object
    "screen.width",
    "screen.height",
    "screen.colorDepth",
    "screen.pixelDepth",
    "screen.availWidth",
    "screen.availHeight",
    "screen.orientation.type",
    
    // Document Object
    "document.cookie",
    // "document.domain",
    "document.referrer",
    "document.hasFocus",
    
    // Window Object
    //"window.localStorage",
    // "window.sessionStorage",
    "window.indexedDB",
    "window.devicePixelRatio",
    "window.matchMedia",
    
    // Canvas & WebGL
    "HTMLCanvasElement.prototype.getContext",
    "WebGLRenderingContext.prototype.getParameter",
    "WebGLRenderingContext.prototype.createBuffer",
    "WebGLRenderingContext.prototype.bindBuffer",
    "WebGLRenderingContext.prototype.bufferData",
    "WebGLRenderingContext.prototype.createShader",
    "WebGLRenderingContext.prototype.shaderSource",
    "WebGLRenderingContext.prototype.compileShader",
    "WebGLRenderingContext.prototype.getShaderParameter",
    "WebGLRenderingContext.prototype.createProgram",
    "WebGLRenderingContext.prototype.attachShader",
    "WebGLRenderingContext.prototype.linkProgram",
    "WebGLRenderingContext.prototype.getProgramParameter",
    "WebGLRenderingContext.prototype.useProgram",
    "WebGLRenderingContext.prototype.getUniformLocation",
    "WebGLRenderingContext.prototype.uniform1i",
    
    // AudioContext
    "AudioContext.prototype.sampleRate",
    "AudioContext.prototype.createOscillator",
    
    // Events
    "document.ontouchstart",
    // "document.onmousemove",
    
    // Time & Date
    "Date.prototype.getTimezoneOffset",
    "Intl.DateTimeFormat().resolvedOptions().timeZone",
    
    // Fetch & XMLHttpRequest
    "window.fetch",
    "XMLHttpRequest.prototype.open",
    "XMLHttpRequest.prototype.send",
    
    // Others
    "CanvasRenderingContext2D.prototype.measureText",
];

function getDomain() {
    return window.location.hostname;
}

function saveAccessToLocalStorage(property, domain, isThirdParty) {
    const localStorageKey = `accessedProperties_${domain}`;
    let accessedProperties = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    console.log(`Current accessed properties for ${domain}:`, accessedProperties);

    // Attempt to find the property in the existing list
    let propertyObject = accessedProperties.find(item => item.property === property);

    if (!propertyObject) {
        // If the property doesn't exist, create a new entry with isThirdParty as an array
        propertyObject = { property, isThirdParty: [isThirdParty] };
        accessedProperties.push(propertyObject);
    } else {
        // Ensure isThirdParty is treated as an array, correcting it if necessary
        if (!Array.isArray(propertyObject.isThirdParty)) {
            propertyObject.isThirdParty = [];
        }

        // Now safely use .includes() as isThirdParty is guaranteed to be an array
        if (!propertyObject.isThirdParty.includes(isThirdParty)) {
            propertyObject.isThirdParty.push(isThirdParty);
        }
    }

    // Update local storage
    localStorage.setItem(localStorageKey, JSON.stringify(accessedProperties));

    console.log(`Updated accessed properties for ${domain}:`, accessedProperties);
}


// Counter to track how many times each property was accessed
const accessedPropertiesCounter = {};

// Function to get the origin (source) of the current script to detect its source 
function getCurrentScriptOrigin() {
    const pageOrigin = window.location.origin;
    if (document.currentScript) {
        const src = document.currentScript.src;
        if (src) {
            try {
                const url = new URL(src);
                // Check if the script's origin is different from the page's origin
                const isThirdParty = url.origin !== pageOrigin;
                return { url: url.toString(), isThirdParty: isThirdParty };
            } catch (e) {
                return { url: "Unknown src", isThirdParty: false };
            }
        } else {
            return { url: "Inline script maybe ?", isThirdParty: false };
        }
    } else {
        return { url: "No document.currentScript result :c", isThirdParty: false };
    }
}


function createProxyHandler(handler) {
    return {
        get(target, prop, receiver) {
            // Log the property access or call the handler function
            console.log(`Property ${prop} has been accessed`);
            handler(`${target.constructor.name.toLowerCase()}.${String(prop)}`, getCurrentScriptOrigin());

            // Proceed to return the property value
            return Reflect.get(target, prop, receiver);
        },
        // You can add more traps here if needed, for example, to intercept function calls or property settings
    };
}

//The function that actually monitor the access to the pre-definded properties 
function monitorAccess(obj, property, handler) {
    const parts = property.split(".");
    console.log(`partsss`,parts)
    let currentObj = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        currentObj = currentObj[parts[i]];
        if (!currentObj) return; // Exit if any part of the path is undefined
    }
    const propName = parts[parts.length - 1];
    const originalValue = currentObj[propName];

    if (typeof originalValue === 'function') {
        currentObj[propName] = function(...args) {
            const origin = getCurrentScriptOrigin();
            handler(`${property}`, origin); // Log the access
            
            try {
                const result = originalValue.apply(this, args);
                // Check if the function returns a promise
                if (result instanceof Promise) {
                    return result.then(value => {
                        // Log promise resolution or perform additional actions
                        console.log(`${property} promise resolved`);
                        return value; // Return the resolved value
                    }).catch(error => {
                        // Log promise rejection or perform additional actions
                        console.log(`${property} promise rejected`);
                        throw error; // Re-throw the error after logging
                    });
                }
                return result; // Return the result directly for non-promise functions
            } catch (error) {
                console.error(`Error calling ${property}:`, error);
                throw error; // Re-throw the error after logging
            }
        };
    } else {
        let value = originalValue;
        Object.defineProperty(currentObj, propName, {
            get: function() {
                const origin = getCurrentScriptOrigin();
                handler(`${property}`, origin); // Log the access
                return value;
            },
            set: function(newValue) {
                value = newValue;
            },
            configurable: true
        });
    }
}


// Function to set up monitoring for all properties in deviceInfoProperties
function setupDeviceInfoMonitoring() {
    deviceInfoProperties.forEach(prop => {
        monitorAccess(window, prop, (accessedProperty, origin) => {
            console.log(`Accessed: ${accessedProperty} from: ${origin}`);
            // Inside monitorAccess or a similar place where you log the access
            const originInfo = getCurrentScriptOrigin();
            saveAccessToLocalStorage(accessedProperty, getDomain(), originInfo.isThirdParty);
            //saveAccessToLocalStorage(accessedProperty, getDomain());
        });
    });
}
// Start the monitoring process
setupDeviceInfoMonitoring();