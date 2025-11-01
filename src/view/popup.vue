<template>
  <div id="popup-container">
    <!-- Modern Header with Logo -->
    <div class="header">
      <div class="header-title">
        <div class="logo-shield">🛡️</div>
        <div class="title-text">
          <h1>Privacy Guard</h1>
          <p class="subtitle">Browser Protection Active</p>
        </div>
      </div>

      <!-- Modern Tab Navigation -->
      <div class="tab-headers">
        <button
          :class="{ 'active-tab': currentTab === 'trackers' }"
          @click="currentTab = 'trackers'"
          class="tab-btn">
          <span class="tab-icon">📊</span>
          <span class="tab-label">Trackers</span>
        </button>
        <button
          :class="{ 'active-tab': currentTab === 'accesses' }"
          @click="currentTab = 'accesses'"
          class="tab-btn">
          <span class="tab-icon">🔍</span>
          <span class="tab-label">Insights</span>
        </button>
      </div>
    </div>

    <!-- Tab Contents -->
    <div class="tab-content">
      <!-- Trackers Summary Tab -->
      <div v-if="currentTab === 'trackers'" class="trackers-summary fade-in">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon tracker-icon">🎯</div>
            <div class="stat-info">
              <div class="stat-label">Unique Trackers</div>
              <div class="stat-value">{{ uniqueTrackers }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon domain-icon">🌐</div>
            <div class="stat-info">
              <div class="stat-label">Parent Domains</div>
              <div class="stat-value">{{ uniqueParentDomains }}</div>
            </div>
          </div>
        </div>

        <div class="protection-status">
          <div class="status-indicator active"></div>
          <span>Protection Active</span>
        </div>
      </div>

      <!-- Access Insights Tab -->
      <div v-if="currentTab === 'accesses'" class="access-insights fade-in">
        <div v-if="localStorageData && localStorageData.value !== 'No data found for this key'"
          class="local-storage-data">
          <h6 class="section-title">🔐 Accessed Properties</h6>
          <div class="scroll-div">
            <ul>
              <li v-for="(item, index) in parsedLocalStorageData" :key="index" class="access-item modern-item">
                <div class="item-content">
                  <span v-if="item.isThirdParty.includes(true) && item.isThirdParty.includes(false)" class="access-badges">
                    <span class="badge badge-third-party">3rd Party</span>
                    <span class="badge badge-local">Local</span>
                  </span>
                  <span v-else-if="item.isThirdParty.includes(true)" class="access-badges">
                    <span class="badge badge-third-party">3rd Party</span>
                  </span>
                  <span v-else class="access-badges">
                    <span class="badge badge-local">Local</span>
                  </span>

                  <div class="property-name">{{ deviceInfoDes[item.property]?deviceInfoDes[item.property]['value']:"N/A"}}</div>
                </div>

                <button class="info-btn" @mouseover="showDescriptioh" @mouseleave="hideDescriptioh">
                  ℹ️
                </button>
                <div class="tooltip-description">{{ deviceInfoDes[item.property]?deviceInfoDes[item.property]['des']:"No description available"}}</div>
              </li>
            </ul>
          </div>

          <div class="legend">
            <div class="legend-item">
              <span class="badge badge-third-party">3rd Party</span>
              <span class="legend-text">External Access</span>
            </div>
            <div class="legend-item">
              <span class="badge badge-local">Local</span>
              <span class="legend-text">Site Access</span>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          <div class="no-data-icon">📭</div>
          <p>No tracking data for this page</p>
          <small>Visit a website to see tracking insights</small>
        </div>
      </div>



    </div>


    <!-- Modern Dashboard Button -->
    <div class="dashboard-footer">
      <button @click="openDashboard" class="dashboard-btn">
        <span class="btn-icon">📈</span>
        <span>Full Dashboard</span>
        <span class="btn-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import CircleProgressBar from './CircleProgressBar.vue';
import { ref, watch, computed } from "vue";

// require('../../public/PrivacyGuard-detect-fp-calls.js')

// import { deviceInfoDes } from '../../public/PrivacyGuard-detect-fp-calls.js'

// const test =require('../../public/PrivacyGuard-detect-fp-calls.js')
// console.log(test);



const deviceInfoDes: {[key: string]: {value: string, des: string }  } = {
  "navigator.userAgent": {
    "value": "userAgent",
    "des": "identifies the browser and operating system, useful for tailoring user experiences, but it also serves as a key component in browser fingerprinting by revealing detailed information about the user's device."
  },
  "navigator.platform": {
    "value": "platform",
    "des": "indicates the platform on which the browser is running, which can be used to optimize web content for specific OS but also contributes to browser fingerprinting by providing another layer of device identification"
  },
  "navigator.vendor": {
    "value": "vendor",
    "des": " returns the browser's vendor name, assisting in customizing web experiences, but also contributes to browser fingerprinting by offering insights into the browser brand used by the visitor."
  },
  "navigator.languages": {
    "value": "languages",
    "des": "provides user's preferred languages, helping websites deliver content in preferred languages, yet it can also assist in browser fingerprinting by revealing language preferences that add to a unique user profile."
  },
  "navigator.deviceMemory": {
    "value": "deviceMemory",
    "des": "a property that tells websites how much memory your device has, helping them adjust for better performance. It can also used to help identify your device uniquely."
  },
  "navigator.hardwareConcurrency": {
    "value": "hardwareConcurrency",
    "des": "It is used to adjust workloads according to the user's CPU capabilities for optmization, but it can also be exploited for browser fingerprinting by collecting hardware-specific data to track users online"
  },
  "navigator.doNotTrack": {
    "value": "doNotTrack",
    "des": "is intended to signal a user's preference for privacy, yet it can inadvertently aid in browser fingerprinting by offering an additional data point that differentiates users based on their tracking preference"
  },
  "navigator.geolocation": {
    "value": "geolocation",
    "des": "provides user location data for improved service delivery, yet can aid in browser fingerprinting by adding geographical information to a user's digital footprin"
  },
  "navigator.plugins": {
    "value": "plugins",
    "des": " lists installed plugins in the user's browser, aiding in feature compatibility checks, but also plays a role in browser fingerprinting by offering insights into the unique configuration of the user's browser setup"
  },
  "navigator.getBattery": {
    "value": "getBattery",
    "des": " offers battery status details to adapt web experiences, but also aids in browser fingerprinting by exposing unique device power characteristics."
  },
  "navigator.connection": {
    "value": "connection",
    "des": " reveals internet connection details to optimize content, yet contributes to browser fingerprinting by distinguishing users based on network traits."
  },
  "navigator.permissions": {
    "value": "permissions",
    "des": "manages browser feature permissions, yet aids in browser fingerprinting by tracking unique user permission settings"
  },

  "navigator.appVersion": {
    "value": "appVersion",
    "des": " reveals browser version for compatibility purposes, yet assists in browser fingerprinting by detailing the user's browser setup."
  },
  "screen.width": {
    "value": "Screen width",
    "des": "provides screen width for responsive design, yet enhances browser fingerprinting by offering unique device dimensions."
  },
  "screen.height": {
    "value": "Screen height",
    "des": "provides screen height for responsive design, yet enhances browser fingerprinting by offering unique device dimensions. "
  },
  "screen.colorDepth": {
    "value": "colorDepth",
    "des": "details display color capacity for content optimization,  yet aids browser fingerprinting by disclosing display quality."
  },
  "screen.pixelDepth": {
    "value": "pixelDepth",
    "des": "Reveals display color depth for content adaptation, yet contributes to browser fingerprinting through unique screen metrics."
  },
  "screen.availWidth": {
    "value": "availWidth",
    "des": "  indicates usable screen width for layout design, yet aids in browser fingerprinting by revealing device-specific usability metrics."
  },
  "screen.availHeight": {
    "value": "availHeight",
    "des": " indicates usable screen height for layout design, yet aids in browser fingerprinting by revealing device-specific usability metrics."
  },
  "screen.orientation.type": {
    "value": "Orientation.type",
    "des": "indicates screen orientation for responsive design, yet contributes to browser fingerprinting by revealing device usage patterns."
  },
  "document.cookie": {
    "value": "cookie",
    "des": " manages website cookies for user data storage, yet can facilitate user tracking by storing unique identifiers."
  },

  // "document.domain": {
  //   "value": "Domain",
  //   "des": "null"
  // },
  // "window.sessionStorage": {
  //   "value": "Session Storage",
  //   "des": "Information on the support of session storage. This attribute is collected through Javascript."
  // },

  "document.referrer": {
    "value": "Referrer",
    "des": "used to track the previous webpage's URL, aiding in browser fingerprinting by revealing user navigation paths"
  },
  "document.hasFocus": {
    "value": "document.hasFocus",
    "des": "enhances user interaction by checking if the page is focused, indirectly aiding in browser fingerprinting through user engagement patterns."
  },
  "window.indexedDB": {
    "value": "indexedDB",
    "des": " enables offline data storage in browsers, indirectly aiding browser fingerprinting by identifying unique database configurations."
  },

  "window.devicePixelRatio": {
    "value": "window.devicePixelRatio",
    "des": "enhances website visuals for your screen's sharpness and aids in browser fingerprinting by identifying device display characteristics."
  },
  "window.matchMedia": {
    "value": "window.matchMedia",
    "des": " used to determine if the content of a webpage matches certain conditions, like screen size or whether dark mode is enabled, which can help websites tailor their appearance and functionality to your device. This capability can also be utilized in browser fingerprinting to gather insights about your device's characteristics without collecting personal information."
  },


  "HTMLCanvasElement.prototype.getContext": {
    "value": "HTMLCanvasElement.prototype.getContext",
    "des": "enables drawing on <canvas>, aiding in browser fingerprinting through unique graphic renderings"
  },
  "WebGLRenderingContext.prototype.getParameter": {
    "value": "WebGLRenderingContext.prototype.getParameter",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.createBuffer": {
    "value": "WebGLRenderingContext.prototype.createBuffer",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.bindBuffer": {
    "value": "WebGLRenderingContext.prototype.bindBuffer",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.bufferData": {
    "value": "WebGLRenderingContext.prototype.bufferData",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.createShader": {
    "value": "WebGLRenderingContext.prototype.createShader",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.shaderSource": {
    "value": "WebGLRenderingContext.prototype.shaderSource",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.compileShader": {
    "value": "WebGLRenderingContext.prototype.compileShader",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.getShaderParameter": {
    "value": "WebGLRenderingContext.prototype.getShaderParameter",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.createProgram": {
    "value": "WebGLRenderingContext.prototype.createProgram",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.linkProgram": {
    "value": "WebGLRenderingContext.prototype.linkProgram",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.useProgram": {
    "value": "WebGLRenderingContext.prototype.useProgram",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.getUniformLocation": {
    "value": "WebGLRenderingContext.prototype.getUniformLocation",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },
  "WebGLRenderingContext.prototype.uniform1i": {
    "value": "WebGLRenderingContext.prototype.uniform1i",
    "des": "WebGLRenderingContext attributes enable advanced graphics in web applications, contributing to browser fingerprinting by revealing unique GPU characteristics."
  },

  "AudioContext.prototype.sampleRate": {
    "value": "AudioContext.sampleRate",
    "des": "specifies the audio processing rate, aiding browser fingerprinting by revealing device-specific audio capabilities."
  },
  "AudioContext.prototype.createOscillator": {
    "value": "AudioContext.createOscillator",
    "des": "is a method for generating sound waves in web applications, useful for creating audio experiences and contributing to browser fingerprinting by analyzing sound wave characteristics to identify unique device behaviors"
  },
  "document.ontouchstart": {
    "value": "Touchstart",
    "des": "detects touch initiation, aiding in browser fingerprinting by signaling touch support."
  },
  // "document.onmousemove": {
  //   "value": "document.onmousemove",
  //   "des": "null"
  // },
  "Date.prototype.getTimezoneOffset": {
    "value": "getTimezoneOffset",
    "des": "identifying user time zones."
  },

  //stopped here
  "Intl.DateTimeFormat().resolvedOptions().timeZone": {
    "value": "TimeZone",
    "des": "returns current timezone"
  },
  "window.fetch": {
    "value": "window.fetch",
    "des": "null"
  },
  "XMLHttpRequest.prototype.open": {
    "value": "XMLHttpRequest.prototype.open",
    "des": "null"
  },
  "XMLHttpRequest.prototype.send": {
    "value": "XMLHttpRequest.prototype.send",
    "des": "null"
  },
  "CanvasRenderingContext2D.prototype.measureText": {
    "value": "CanvasRenderingContext2D.prototype.measureText",
    "des": "null"
  },
  "navigator.maxTouchPoints": {
    "value": "navigator.maxTouchPoints",
    "des": "to detect if the device used support touch and number of max touches allowed"
  },
  "navigator.onLine": {
    "value": "navigator.onLine",
    "des": "indicates if the user is connected to the internet or not"
  },
  
  "navigator.mimeTypes": {
    "value": "navigator.mimeTypes",
    "des": "null"
  }
}



const currentTab = ref('trackers');
const uniqueTrackersCount = ref(0);
const totalCount = ref(0);
const uniqueTrackers = ref(0);
const uniqueParentDomains = ref(0);
//let localStorageData = ref<string | null>(null);
//const localStorageData = ref('');
const localStorageData = ref('') as unknown as { value: string };



// Function to fetch data from the webpage's local storage
const fetchLocalStorageData = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].id != null && tabs[0].url) {
      const currentDomain = new URL(tabs[0].url).hostname;
      const localStorageKey = `accessedProperties_${currentDomain}`;

      chrome.tabs.sendMessage(tabs[0].id, { action: "getLocalStorageDataForKey", key: localStorageKey }, response => {
        localStorageData.value = response ? response.data : 'No data found for this key.';
      });
    }
  });
};

watch(currentTab, (newTab) => {
  if (newTab === 'accesses') {
    fetchLocalStorageData();
  }
  if (newTab === 'trackers') {
    chrome.runtime.sendMessage({ action: "getTrackers" }, (response) => {
      if (response) {
        // totalCount.value = response.detectedTrackers.length;
        uniqueParentDomains.value = response.uniqueDomainsCount;
        uniqueTrackers.value = response.uniqueTrackersCount;
      } else {
        console.error("No tracker data received.");
      }
    });
  }
});
const getHighlightClass = (item: string) => {
  // High Privacy Concern - Red
  const highPrivacy = [
    'navigator.deviceMemory',
    'navigator.hardwareConcurrency',
    'navigator.geolocation',
    'document.cookie',
    'window.localStorage',
    'window.sessionStorage',
    'window.indexedDB',
  ];

  // Medium Privacy Concern - Orange
  const mediumPrivacy = [
    'navigator.appVersion',
    'navigator.platform',
    'navigator.vendor',
    'navigator.languages',
    'navigator.maxTouchPoints',
    'screen.width',
    'screen.height',
    'navigator.connection',
  ];

  // Lower Privacy Concern - Yellow
  const lowerPrivacy = [
    'navigator.onLine',
    'screen.orientation.type',
    'document.hasFocus',
    'navigator.getBattery',
  ];

  if (highPrivacy.some(attr => item.includes(attr))) {
    return 'highlight-red'; // High privacy concern
  }
  if (mediumPrivacy.some(attr => item.includes(attr))) {
    return 'highlight-orange'; // Medium privacy concern
  }
  if (lowerPrivacy.some(attr => item.includes(attr))) {
    return 'highlight-yellow'; // Lower privacy concern
  }
  return ''; // Default, no additional class
};

const openDashboard = () => {
  chrome.tabs.create({ url: 'dashboard.html' });
};

function showDescriptioh(e:any) {
  console.log(e)
  console.log(e.target.nextElementSibling.style.display = 'block')
  // document.getElementBy(`topTrackersChart`).style.display = 'block';

}

function hideDescriptioh(e:any) {
  console.log(e)
  console.log(e.target.nextElementSibling.style.display = 'none')
  // document.getElementBy(`topTrackersChart`).style.display = 'block';

}

// Computed property to parse the local storage data into an array
const parsedLocalStorageData = computed(() => {
  if (localStorageData.value) {
    try {
      const data = JSON.parse(localStorageData.value);
      return data.map((item: { isThirdParty: any; }) => ({
        ...item,
        isThirdParty: Array.isArray(item.isThirdParty) ? item.isThirdParty : [],
      }));
    } catch (e) {
      console.error("Error parsing localStorageData:", e);
      return []; // Return an empty array if parsing fails
    }
  }
  return [];
});



</script>


<style scoped>
@import './popup-styles.css';
</style>
