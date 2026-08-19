<template>
  <div id="popup-container">
    <!-- Header -->
    <div class="header">
      <div class="header-title">
        <img v-if="logoUrl" :src="logoUrl" class="header-logo" alt="PrivacyGuard" />
        <div v-else class="header-logo header-logo-fallback">🛡</div>
        <div class="title-text">
          <h1>PrivacyGuard</h1>
          <div class="mode-pill" :class="`mode-${protectionBanner.tone}`">
            <span class="mode-dot"></span>
            <span class="mode-label">{{ protectionBanner.label }}</span>
          </div>
        </div>
        <button class="header-settings" :title="protectionBanner.detail" @click="openSettings" aria-label="Settings">
          ⚙
        </button>
      </div>

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
          <span class="tab-icon">🧬</span>
          <span class="tab-label">Fingerprint</span>
        </button>
      </div>
    </div>

    <!-- Tab Contents -->
    <div class="tab-content">
      <!-- Trackers Summary Tab -->
      <div v-if="currentTab === 'trackers'" class="trackers-summary fade-in">
        <div class="scope-note">Counts since extension installed (active profile)</div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-info">
              <div class="stat-label">Unique Trackers</div>
              <div class="stat-value">{{ uniqueTrackers }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">🌐</div>
            <div class="stat-info">
              <div class="stat-label">Parent Domains</div>
              <div class="stat-value">{{ uniqueParentDomains }}</div>
            </div>
          </div>
        </div>

        <div class="risk-block" :class="`risk-block-${overallRisk.level}`">
          <div class="risk-block-head">
            <span class="risk-block-title">Risk profile</span>
            <span class="risk-block-tag">{{ overallRisk.label }}</span>
          </div>
          <div class="risk-pills">
            <div class="risk-pill risk-critical" :class="{ dim: riskBreakdown.critical === 0 }">
              <span class="risk-pill-num">{{ riskBreakdown.critical }}</span>
              <span class="risk-pill-lbl">Critical</span>
            </div>
            <div class="risk-pill risk-high" :class="{ dim: riskBreakdown.high === 0 }">
              <span class="risk-pill-num">{{ riskBreakdown.high }}</span>
              <span class="risk-pill-lbl">High</span>
            </div>
            <div class="risk-pill risk-medium" :class="{ dim: riskBreakdown.medium === 0 }">
              <span class="risk-pill-num">{{ riskBreakdown.medium }}</span>
              <span class="risk-pill-lbl">Med</span>
            </div>
            <div class="risk-pill risk-low" :class="{ dim: riskBreakdown.low === 0 }">
              <span class="risk-pill-num">{{ riskBreakdown.low }}</span>
              <span class="risk-pill-lbl">Low</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Fingerprint / Access Insights Tab -->
      <div v-if="currentTab === 'accesses'" class="access-insights fade-in">
        <div v-if="localStorageData && localStorageData.value !== 'No data found for this key.'"
          class="local-storage-data">
          <div class="section-title">
            <span>🧬 Data this site read</span>
            <span class="section-count">{{ parsedLocalStorageData.length }}</span>
          </div>
          <div class="scroll-div">
            <ul>
              <li
                v-for="item in parsedLocalStorageData"
                :key="item.property"
                class="access-item"
                :class="`tier-${item.tier}`">
                <div class="item-row">
                  <span class="tier-dot" :class="`tier-dot-${item.tier}`"></span>
                  <div class="property-name">
                    {{ deviceInfoDes[item.property] ? deviceInfoDes[item.property]['value'] : item.property }}
                  </div>
                  <span class="access-badges">
                    <span v-if="item.isThirdParty.includes(true)" class="badge badge-third-party">3rd</span>
                    <span v-if="item.isThirdParty.includes(false)" class="badge badge-local">1st</span>
                  </span>
                  <button
                    v-if="hasDescription(item.property)"
                    class="info-btn"
                    @mouseenter="activeTooltipKey = item.property"
                    @mouseleave="activeTooltipKey = null"
                    @click.stop="activeTooltipKey = activeTooltipKey === item.property ? null : item.property"
                    aria-label="Show description">
                    ℹ
                  </button>
                </div>
                <div
                  v-if="activeTooltipKey === item.property && hasDescription(item.property)"
                  class="tooltip-description">
                  {{ deviceInfoDes[item.property]['des'] }}
                </div>
              </li>
            </ul>
          </div>

          <div class="legend">
            <span class="legend-item"><span class="tier-dot tier-dot-high"></span>High</span>
            <span class="legend-item"><span class="tier-dot tier-dot-medium"></span>Medium</span>
            <span class="legend-item"><span class="tier-dot tier-dot-low"></span>Low</span>
            <span class="legend-spacer"></span>
            <span class="legend-item"><span class="badge badge-third-party badge-mini">3rd</span>External</span>
          </div>
        </div>
        <div v-else class="no-data">
          <div class="no-data-icon">🧬</div>
          <p>No fingerprint accesses yet</p>
          <small>Reload the current tab — events will appear here.</small>
        </div>
      </div>
    </div>

    <!-- Footer -->
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
import { ref, watch, computed, onMounted } from "vue";
import { getTrackerInfo } from '../data/trackerDatabase';

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



type ExperimentMode = 'off' | 'monitor-only' | 'mitigation-on';

const currentTab = ref<'trackers' | 'accesses'>('trackers');
const uniqueTrackers = ref(0);
const uniqueParentDomains = ref(0);
const localStorageData = ref('') as unknown as { value: string };
const currentDomainRef = ref<string>('');
const activeTooltipKey = ref<string | null>(null);
const experimentMode = ref<ExperimentMode>('mitigation-on');
const selectedProfile = ref<string>('allProfiles');
const allTrackers = ref<Record<string, any[]>>({});
const logoUrl = ref<string>('');
try { logoUrl.value = chrome.runtime.getURL('logo.png'); } catch (_) { logoUrl.value = ''; }

// Banner shown at the top of the popup reflects the experiment mode so the
// "Browser Protection Active" line never lies.
const protectionBanner = computed(() => {
  switch (experimentMode.value) {
    case 'off':
      return { label: 'Extension off', tone: 'danger', detail: 'No monitoring, no mitigation.' };
    case 'monitor-only':
      return { label: 'Monitoring only', tone: 'warning', detail: 'Logging on, mitigation off.' };
    default:
      return { label: 'Full protection', tone: 'success', detail: `Active profile: ${selectedProfile.value === 'allProfiles' ? 'none' : selectedProfile.value}` };
  }
});

const riskBreakdown = computed(() => {
  const profileKey = allTrackers.value[selectedProfile.value]
    ? selectedProfile.value
    : Object.keys(allTrackers.value)[0];
  const list = profileKey ? (allTrackers.value[profileKey] || []) : [];
  const seen = new Set<string>();
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const t of list) {
    if (seen.has(t.trackerDomain)) continue;
    seen.add(t.trackerDomain);
    const info = getTrackerInfo(t.trackerDomain);
    if (info) (counts as any)[info.riskLevel]++;
  }
  return counts;
});

const overallRisk = computed(() => {
  const c = riskBreakdown.value;
  if (c.critical > 0) return { level: 'critical', label: 'Critical' };
  if (c.high > 0) return { level: 'high', label: 'High' };
  if (c.medium > 0) return { level: 'medium', label: 'Medium' };
  if (c.low > 0) return { level: 'low', label: 'Low' };
  return { level: 'none', label: 'Clear' };
});

// Properties whose dictionary description is missing or the literal string
// "null" shouldn't show an info affordance — clicking it returns nothing.
function hasDescription(propKey: string): boolean {
  const entry = deviceInfoDes[propKey];
  if (!entry) return false;
  const des = entry.des;
  return !!des && des !== 'null';
}

function loadTrackerData() {
  chrome.runtime.sendMessage({ action: 'getTrackers' }, (response) => {
    if (!response) return;
    uniqueParentDomains.value = response.uniqueDomainsCount || 0;
    uniqueTrackers.value = response.uniqueTrackersCount || 0;
    allTrackers.value = response.trackers || {};
  });
}

onMounted(() => {
  // Trackers tab is initial; we used to rely on the watch firing on switch,
  // which never happened on first mount — load eagerly.
  loadTrackerData();
  fetchLocalStorageData();
  chrome.storage.local.get(['experimentMode', 'selectedProfile'], (data) => {
    experimentMode.value = (data.experimentMode as ExperimentMode) || 'mitigation-on';
    selectedProfile.value = data.selectedProfile || 'allProfiles';
  });
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.experimentMode) {
      experimentMode.value = (changes.experimentMode.newValue as ExperimentMode) || 'mitigation-on';
    }
    if (changes.selectedProfile) {
      selectedProfile.value = changes.selectedProfile.newValue || 'allProfiles';
    }
  });
});



// Property-access data now lives in chrome.storage.local (centralized for export).
// Background re-derives the per-domain {property, isThirdParty[]} view for us.
const fetchLocalStorageData = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0 && tabs[0].url) {
      let currentDomain = '';
      try { currentDomain = new URL(tabs[0].url).hostname; } catch (_) { currentDomain = ''; }
      currentDomainRef.value = currentDomain;
      if (!currentDomain) {
        localStorageData.value = 'No data found for this key.';
        return;
      }
      chrome.runtime.sendMessage(
        { action: "getPropertyAccessForDomain", domain: currentDomain },
        (response) => {
          if (response && Array.isArray(response.data) && response.data.length > 0) {
            localStorageData.value = JSON.stringify(response.data);
          } else {
            localStorageData.value = 'No data found for this key.';
          }
        }
      );
    }
  });
};

// Property risk tier matches dashboard semantics; used to color-code list items
// so users can see *what kind* of access they're looking at, not just a flat list.
const HIGH_RISK_PROPS = [
  'navigator.deviceMemory', 'navigator.hardwareConcurrency', 'navigator.geolocation',
  'document.cookie', 'window.localStorage', 'window.sessionStorage', 'window.indexedDB',
  'HTMLCanvasElement.prototype.getContext', 'CanvasRenderingContext2D.prototype.measureText',
  'WebGLRenderingContext.prototype.getParameter', 'AudioContext.prototype.createOscillator'
];
const MEDIUM_RISK_PROPS = [
  'navigator.appVersion', 'navigator.platform', 'navigator.vendor', 'navigator.languages',
  'navigator.maxTouchPoints', 'navigator.connection', 'screen.width', 'screen.height',
  'screen.colorDepth', 'screen.pixelDepth', 'Date.prototype.getTimezoneOffset',
  'Intl.DateTimeFormat().resolvedOptions().timeZone'
];
function propertyRiskTier(prop: string): 'high' | 'medium' | 'low' {
  if (HIGH_RISK_PROPS.some(p => prop.includes(p)) || prop.startsWith('WebGLRenderingContext')) return 'high';
  if (MEDIUM_RISK_PROPS.some(p => prop.includes(p))) return 'medium';
  return 'low';
}

const openDashboard = () => {
  chrome.tabs.create({ url: 'dashboard.html' });
};

const openSettings = () => {
  chrome.tabs.create({ url: 'dashboard.html#/settings' });
};

// Parsed + risk-decorated + sorted: high-risk accesses surface first so
// scanning the list answers "what's the worst thing this site looked at" fast.
const parsedLocalStorageData = computed(() => {
  if (!localStorageData.value) return [];
  try {
    const data = JSON.parse(localStorageData.value);
    const tierWeight: Record<string, number> = { high: 0, medium: 1, low: 2 };
    return data
      .map((item: { property: string; isThirdParty: any }) => {
        const tier = propertyRiskTier(item.property);
        const isThirdParty = Array.isArray(item.isThirdParty) ? item.isThirdParty : [];
        return { ...item, isThirdParty, tier };
      })
      .sort((a: any, b: any) => {
        const w = tierWeight[a.tier] - tierWeight[b.tier];
        if (w !== 0) return w;
        // Third-party access first within a tier — that's the more concerning case.
        const at = a.isThirdParty.includes(true) ? 0 : 1;
        const bt = b.isThirdParty.includes(true) ? 0 : 1;
        return at - bt;
      });
  } catch (e) {
    return [];
  }
});



</script>


<style scoped>
@import './popup-styles.css';
</style>
