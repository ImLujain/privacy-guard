<template>
    <div class="dashboard-container">
        <!-- Modern Header -->
        <header class="dashboard-header">
            <div class="header-content">
                <div class="header-title">
                    <span class="header-icon">🛡️</span>
                    <div>
                        <h1>Privacy Guard Dashboard</h1>
                        <p class="header-subtitle">Monitor your browser protection in real-time</p>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <div class="dashboard-content">
            <!-- Profile Selector -->
            <div class="profile-selector-card">
                <label for="profileSelect" class="profile-selector-label">🎭 Active Profile</label>
                <select id="profileSelect" class="profile-select">
                    <option value="allProfiles" selected>🔓 Real Identity</option>
                    <option value="profile1">💻 Windows Desktop</option>
                    <option value="profile2">🍎 MacBook Air</option>
                    <option value="profile3">📱 iPhone</option>
                </select>
            </div>

            <!-- Main Grid -->
            <div class="dashboard-grid">
                <!-- Trackers Section -->
                <div class="section-card">
                    <div class="section-header">
                        <span class="section-icon">📊</span>
                        <h2 class="section-title">Tracker Activity</h2>
                    </div>

                    <div id="table-info">
                        <!-- Chart -->
                        <div class="chart-container">
                            <canvas id="topTrackersChart"></canvas>
                        </div>

                        <!-- Table -->
                        <div class="table-container">
                            <table id="trackerTable" class="modern-table">
                                <thead>
                                    <tr>
                                        <th>Tracker Domain</th>
                                        <th>Parent Domain</th>
                                        <th>Timestamp</th>
                                        <th>Category</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Table rows will be inserted here dynamically -->
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div class="pagination-container">
                            <button class="pagination-btn">Previous</button>
                            <button class="pagination-btn active">1</button>
                            <button class="pagination-btn">2</button>
                            <button class="pagination-btn">3</button>
                            <button class="pagination-btn">Next</button>
                        </div>

                        <!-- Clear Data Button -->
                        <div class="clear-data-container">
                            <button @click="clearStoredData" id="clearData" class="clear-btn">
                                🗑️ Clear All Data
                            </button>
                        </div>
                    </div>

                    <!-- No Results State -->
                    <div id="no-result" class="no-results" style="display: none;">
                        <div class="no-results-icon">📭</div>
                        <p class="no-results-text">No trackers detected</p>
                        <p class="no-results-subtext">Visit websites to see tracking activity</p>
                    </div>
                </div>

                <!-- AI Insights Section -->
                <div id="ai-insights-card" class="section-card" style="display: none;">
                    <div class="section-header">
                        <span class="section-icon">🤖</span>
                        <h2 class="section-title">Privacy Insights</h2>
                        <span id="ai-badge" class="ai-badge">AI Powered</span>
                        <button id="refresh-insights-btn" class="refresh-btn" title="Refresh AI Insights">🔄</button>
                    </div>

                    <div id="ai-insights-content">
                        <!-- Risk Score Badge -->
                        <div class="risk-score-container">
                            <div class="risk-score-badge" id="risk-score-badge">
                                <div class="risk-score-label">Privacy Score</div>
                                <div class="risk-score-value" id="privacy-score">--</div>
                                <div class="risk-score-sublabel" id="risk-level">Calculating...</div>
                            </div>
                            <div class="risk-breakdown">
                                <div class="risk-breakdown-item">
                                    <span class="risk-dot critical"></span>
                                    <span id="critical-count">0</span> Critical
                                </div>
                                <div class="risk-breakdown-item">
                                    <span class="risk-dot high"></span>
                                    <span id="high-count">0</span> High
                                </div>
                                <div class="risk-breakdown-item">
                                    <span class="risk-dot medium"></span>
                                    <span id="medium-count">0</span> Medium
                                </div>
                                <div class="risk-breakdown-item">
                                    <span class="risk-dot low"></span>
                                    <span id="low-count">0</span> Low
                                </div>
                            </div>
                        </div>

                        <!-- Summary -->
                        <div class="insight-section">
                            <h3 class="insight-title">📋 Summary</h3>
                            <p class="insight-text" id="ai-summary">Loading insights...</p>
                        </div>

                        <!-- Risk Analysis -->
                        <div class="insight-section">
                            <h3 class="insight-title">⚠️ Risk Analysis</h3>
                            <p class="insight-text" id="ai-risk-analysis">Analyzing tracker data...</p>
                        </div>

                        <!-- Recommendations -->
                        <div class="insight-section">
                            <h3 class="insight-title">💡 Recommendations</h3>
                            <ul class="recommendations-list" id="ai-recommendations">
                                <li>Loading recommendations...</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Browser Fingerprint Section -->
                <div id="fingerprint-info" class="section-card">
                    <div class="section-header">
                        <span class="section-icon">🔐</span>
                        <h2 class="section-title">Browser Fingerprint</h2>
                    </div>

                    <div class="fingerprint-grid">
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">💻 Platform</div>
                            <div class="fingerprint-value" id="fingerprint-platform"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">🔌 Plugins</div>
                            <div class="fingerprint-value" id="fingerprint-plugins"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">🌐 User Agent</div>
                            <div class="fingerprint-value" id="fingerprint-userAgent"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">🗣️ Languages</div>
                            <div class="fingerprint-value" id="fingerprint-languages"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">💾 Device Memory</div>
                            <div class="fingerprint-value" id="fingerprint-deviceMemory"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">🔋 Battery</div>
                            <div class="fingerprint-value" id="fingerprint-battery"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">📹 Media Devices</div>
                            <div class="fingerprint-value" id="fingerprint-mediaDevices"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">📄 MIME Types</div>
                            <div class="fingerprint-value" id="fingerprint-mimeTypes"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">⚙️ Hardware Cores</div>
                            <div class="fingerprint-value" id="fingerprint-hardwareConcurrency"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">🖥️ Screen Resolution</div>
                            <div class="fingerprint-value" id="fingerprint-screenResolution"></div>
                        </div>
                        <div class="fingerprint-row">
                            <div class="fingerprint-label">🕐 Timezone Offset</div>
                            <div class="fingerprint-value" id="fingerprint-timezoneOffset"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>

import { onMounted } from 'vue';
import { getTrackerInfo, calculateOverallRisk, getRiskColor } from '../data/trackerDatabase';
import { getInsights } from '../services/aiService';
onMounted(() => {
    populateFingerprintInfo();


    const profileSelect = document.getElementById('profileSelect');

    // Set default profile if none is set
    chrome.storage.local.get('selectedProfile', function (data) {
        if (!data.selectedProfile) {
            chrome.storage.local.set({ selectedProfile: 'allProfiles' });
        } else {
            profileSelect.value = data.selectedProfile;
        }
    });
    //event listner for when profile gets changed
    profileSelect.addEventListener('change', function () {
        const selectedProfile = profileSelect.value;
        chrome.storage.local.set({ selectedProfile: selectedProfile }, function () {
            loadTrackersForProfile();
            if (selectedProfile != 'allProfiles'){
            loadProfileInfo(selectedProfile);
            }
            else {
                populateFingerprintInfo();
            }
        });
    });
    //for table pagination, it supposed to show 4 profiles 
    document.querySelectorAll('.page-link').forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            if (index === 0) { // Previous button
                currentPage = Math.max(1, currentPage - 1);
            } else if (index === 4) { // Next button
                currentPage += 1; // You might want to add a check to ensure it doesn't exceed the total number of pages
            } else {
                currentPage = index; // 1-based index
            }

            loadTrackersForProfile(); // Reload the table with the new page
        });
    });

    loadTrackersForProfile();

    // Add refresh button listener for AI insights
    const refreshBtn = document.getElementById('refresh-insights-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            console.log('[Dashboard] Manual refresh requested');
            loadTrackersForProfile(); // This will reload trackers and AI insights
        });
    }

    // Listen for AI config changes and auto-refresh insights
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes.aiConfig) {
            console.log('[Dashboard] AI config changed, refreshing insights...');
            console.log('[Dashboard] Old config:', changes.aiConfig.oldValue);
            console.log('[Dashboard] New config:', changes.aiConfig.newValue);

            // Reload insights when AI config changes
            setTimeout(() => {
                loadTrackersForProfile();
            }, 500); // Small delay to ensure config is saved
        }
    });

});

// //This function that reads your browser fingerprint to show them 
async function populateFingerprintInfo() {
    document.getElementById('fingerprint-platform').textContent = navigator.platform;
    document.getElementById('fingerprint-plugins').textContent = `${navigator.plugins.length} plugins`;
    document.getElementById('fingerprint-userAgent').textContent = navigator.userAgent || 'Not available';
    document.getElementById('fingerprint-languages').textContent = navigator.languages.join(', ');
    document.getElementById('fingerprint-deviceMemory').textContent = navigator.deviceMemory || 'Not available';
    await populateBatteryInfo(); // Asynchronously populate battery info
    //document.getElementById('fingerprint-connection').textContent = navigator.connection ? JSON.stringify(navigator.connection) : 'Not available';
    document.getElementById('fingerprint-mediaDevices').textContent = navigator.mediaDevices ? 'Accessible' : 'Not accessible';
    document.getElementById('fingerprint-mimeTypes').textContent = `${navigator.mimeTypes.length} mime types`;
    document.getElementById('fingerprint-hardwareConcurrency').textContent = navigator.hardwareConcurrency;
    document.getElementById('fingerprint-screenResolution').textContent = `${screen.width}x${screen.height}`;
    populateTimezoneOffset();
    // populateDateTimeFormat();
}

function loadProfileInfo(selectedProfile) {
    const profileData = {
        profile1: {
            platform: "Win32",
            plugins: "5 plugins",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            languages: "en-US, en",
            deviceMemory: "8 GB",
            battery: "100% (plugged in)",
            mediaDevices: "Accessible",
            mimeTypes: "2 mime types",
            hardwareConcurrency: "8 cores",
            screenResolution: "1920x1080",
            timezoneOffset: "UTC-5 (America/New_York)",
            dateTimeFormat: "en-US"
        },
        profile2: {
            platform: "MacIntel",
            plugins: "2 plugins",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
            languages: "en-US, en",
            deviceMemory: "8 GB",
            battery: "Not available (Safari privacy)",
            mediaDevices: "Accessible",
            mimeTypes: "1 mime type",
            hardwareConcurrency: "8 cores",
            screenResolution: "1440x900",
            timezoneOffset: "UTC-7 (America/Los_Angeles)",
            dateTimeFormat: "en-US"
        },
        profile3: {
            platform: "iPhone",
            plugins: "0 plugins",
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1",
            languages: "en-US, en",
            deviceMemory: "Not available (iOS)",
            battery: "Not available (iOS privacy)",
            mediaDevices: "Accessible",
            mimeTypes: "0 mime types",
            hardwareConcurrency: "6 cores",
            screenResolution: "390x844",
            timezoneOffset: "UTC-5 (America/Chicago)",
            dateTimeFormat: "en-US"
        }
    };

    // Assuming 'selectedProfile' is one of 'profile1', 'profile2', 'profile3'
    const data = profileData[selectedProfile];

    // Update the table with the selected profile's data
    document.getElementById('fingerprint-platform').textContent = data.platform;
    document.getElementById('fingerprint-plugins').textContent = data.plugins;
    document.getElementById('fingerprint-userAgent').textContent = data.userAgent;
    document.getElementById('fingerprint-languages').textContent = data.languages;
    document.getElementById('fingerprint-deviceMemory').textContent = data.deviceMemory;
    document.getElementById('fingerprint-battery').textContent = data.battery;
    document.getElementById('fingerprint-mediaDevices').textContent = data.mediaDevices;
    document.getElementById('fingerprint-mimeTypes').textContent = data.mimeTypes;
    document.getElementById('fingerprint-hardwareConcurrency').textContent = data.hardwareConcurrency;
    document.getElementById('fingerprint-screenResolution').textContent = data.screenResolution;
    document.getElementById('fingerprint-timezoneOffset').textContent = data.timezoneOffset;
    // document.getElementById('fingerprint-dateTimeFormat').textContent = data.dateTimeFormat;
}


async function populateBatteryInfo() {
    if ('getBattery' in navigator) {
        try {
            const battery = await navigator.getBattery();
            const batteryLevel = Math.round(battery.level * 100) + '%';
            const chargingStatus = battery.charging ? 'charging' : 'not charging';
            document.getElementById('fingerprint-battery').textContent = `Level: ${batteryLevel}, Status: ${chargingStatus}`;
        } catch (error) {
            document.getElementById('fingerprint-battery').textContent = 'Battery info not accessible';
            console.error('Error accessing battery info:', error);
        }
    } else {
        document.getElementById('fingerprint-battery').textContent = 'Battery API not supported';
    }
}

function populateTimezoneOffset() {
    const offset = new Date().getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMinutes = Math.abs(offset) % 60;
    const sign = offset > 0 ? "-" : "+";
    document.getElementById('fingerprint-timezoneOffset').textContent = `UTC ${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
}

function populateDateTimeFormat() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateTimeFormat = new Intl.DateTimeFormat('default', options).format(new Date());
    document.getElementById('fingerprint-dateTimeFormat').textContent = dateTimeFormat;
}



let topTrackersChartInstance = null;
function loadTrackersForProfile() {
    let selectedProfile = profileSelect.value;
    // Initially hide all charts
    ['allProfiles','profile1', 'profile2', 'profile3'].forEach(profile => {
        const element = document.getElementById(`topTrackersChart`);
        if (element) {
            element.style.display = 'none';
        }
    });
    var profiletest = ['allProfiles','profile1', 'profile2', 'profile3'];
    profiletest = [selectedProfile];

    // if (selectedProfile != 'allProfiles') {
    //     profiletest = [selectedProfile];
    // }
    console.log(selectedProfile)

    console.log('profiletest')

    console.log(profiletest)
    // Show only the chart for the selected profile


    profiletest.forEach(profile => {
        chrome.runtime.sendMessage({ action: "getTrackers", profile: profile }, function (response) {
            const tableBody = document.getElementById('trackerTable').querySelector('tbody');
            tableBody.innerHTML = '';

            const trackers = response.trackers[profile] || [];
            console.log(profile)
            console.log(response.trackers[profile])
            if (trackers.length > 0) {
                populateTable(trackers, tableBody);
                displayTopCategoriesChart(trackers, profile);
                loadAIInsights(trackers); // Load AI insights
                profiletest.forEach(profile => {
                    document.getElementById(`topTrackersChart`).style.display = 'block';

                });

                document.getElementById('no-result').style.display = 'none';
                document.getElementById('table-info').style.display = 'block';

            } else {
                document.getElementById('table-info').style.display = 'none';
                document.getElementById('no-result').style.display = 'block';
                document.getElementById('ai-insights-card').style.display = 'none'; // Hide AI insights when no trackers

            }
        });
    })
}

// function loadAllProfiles() {
//     const profiles = ['profile1', 'profile2', 'profile3'];
//     console.log('gggggggggggggggggggggggggggggggggggggggggggg');
//     profiles.forEach(profile => {
//         chrome.runtime.sendMessage({action: "getTrackers", profile: profile}, function(response) {
//             const trackers = response.trackers[profile] || [];
//             console.log(trackers);
//             if (trackers.length > 0) {
//                 console.log('gggggggggggggggggggggggggggggggggggggggggggg');
//                 displayTopCategoriesChart(trackers, profile);
//             }
//         });
//     });

//     // Show all charts
//     ['profile1', 'profile2', 'profile3'].forEach(profile => {
//         document.getElementById(`topTrackersChart-${profile}`).style.display = 'block';
//     });
// }

// // load all tracker for all trackers option
// function loadAllProfiles() {
//     const profiles = ['profile1', 'profile2', 'profile3'];
//     profiles.forEach(profile => {
//         chrome.runtime.sendMessage({action: "getTrackers", profile: profile}, function(response) {
//             const trackers = response.trackers[profile] || [];
//             if (trackers.length > 0) {
//                 displayTopCategoriesChart(trackers, profile);
//             }
//         });
//     });
// }

let currentPage = 1;
const entriesPerPage = 5;

function populateTable(trackers, tableBody) {
    tableBody.innerHTML = '';

    // Determine the start and end index based on the current page
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = startIndex + entriesPerPage;

    const trackersToDisplay = trackers.slice(startIndex, endIndex);

    trackersToDisplay.forEach(trackerInfo => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = trackerInfo.trackerDomain;
        row.insertCell(1).textContent = trackerInfo.parentDomain;
        row.insertCell(2).textContent = trackerInfo.timestamp;
        row.insertCell(3).textContent = trackerInfo.category;
    });
}

function displayTopCategoriesChart(trackers, profile) {
    const categoryCounts = {};

    trackers.forEach(tracker => {
        const category = tracker.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);
    const topCategories = sortedCategories.slice(0, 10);
    const topCategoriesCounts = topCategories.map(category => categoryCounts[category]);

    const colors = topCategories.map((_, i) => `hsla(${i * 25}, 70%, 50%, 0.2)`);
    const borderColors = topCategories.map((_, i) => `hsla(${i * 25}, 70%, 50%, 1)`);

    const canvasId = 'topTrackersChart';
    const ctx = document.getElementById(canvasId).getContext('2d');

    if (window[`topTrackersChartInstance`]) {
        window[`topTrackersChartInstance`].destroy();
    }

    const chartTitle = {
        'profile1': 'Profile 1',
        'profile2': 'Profile 2',
        'profile3': 'Profile 3',
        'allProfiles' : 'allProfiles'
    }[profile];

    window[`topTrackersChartInstance`] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topCategories,
            datasets: [{
                label: '# of Times Detected',
                data: topCategoriesCounts,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            title: {
                display: true,
                text: chartTitle,
                fontSize: 16,
                padding: 20
            }
        }
    });
}

function clearStoredData() {
    chrome.storage.local.clear(function () {
        const error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        } else {
            console.log("Stored data has been cleared.");
        }
    });
}

// Load AI Insights
async function loadAIInsights(trackers) {
    if (!trackers || trackers.length === 0) {
        document.getElementById('ai-insights-card').style.display = 'none';
        return;
    }

    // Show the AI insights card
    const insightsCard = document.getElementById('ai-insights-card');
    insightsCard.style.display = 'block';

    // Add loading state to refresh button
    const refreshBtn = document.getElementById('refresh-insights-btn');
    if (refreshBtn) {
        refreshBtn.classList.add('loading');
        refreshBtn.style.pointerEvents = 'none';
    }

    // Get tracker info with risk scores
    const trackerDataWithRisk = trackers.map(tracker => {
        const info = getTrackerInfo(tracker.trackerDomain);
        return {
            ...tracker,
            ...info,
            // Preserve the original category from Disconnect.me if it exists
            category: tracker.category || info.category || 'Unknown'
        };
    });

    // Calculate overall risk
    const trackerDomains = trackers.map(t => t.trackerDomain);
    const overallRisk = calculateOverallRisk(trackerDomains);

    // Update risk score badge
    document.getElementById('privacy-score').textContent = overallRisk.score;
    document.getElementById('risk-level').textContent = overallRisk.level.toUpperCase();

    // Update risk score badge color
    const riskBadge = document.getElementById('risk-score-badge');
    const riskColor = getRiskColor(overallRisk.level);
    riskBadge.style.borderColor = riskColor;
    document.getElementById('privacy-score').style.color = riskColor;

    // Update risk breakdown counts
    document.getElementById('critical-count').textContent = overallRisk.criticalCount;
    document.getElementById('high-count').textContent = overallRisk.highCount;
    document.getElementById('medium-count').textContent = overallRisk.mediumCount;
    document.getElementById('low-count').textContent = overallRisk.lowCount;

    // Get AI insights (will use rule-based by default, or Ollama if enabled)
    try {
        console.log('[Dashboard] Requesting insights for', trackerDataWithRisk.length, 'trackers');
        const insights = await getInsights(trackerDataWithRisk, overallRisk.score, overallRisk.level);
        console.log('[Dashboard] Received insights from:', insights.source);

        // Update AI badge based on the actual source of insights
        const aiBadge = document.getElementById('ai-badge');

        if (insights.source === 'ai') {
            console.log('[Dashboard] ✓ Displaying AI-generated insights');
            aiBadge.textContent = 'AI Powered';
            aiBadge.style.background = 'linear-gradient(135deg, #10ac84 0%, #0abde3 100%)';
        } else {
            console.log('[Dashboard] Displaying rule-based insights');
            // Check if AI was enabled but failed
            chrome.storage.local.get(['aiConfig'], (data) => {
                const isAIEnabled = data.aiConfig && data.aiConfig.enabled;
                if (isAIEnabled) {
                    aiBadge.textContent = 'Rule-Based (AI Unavailable)';
                    aiBadge.style.background = 'linear-gradient(135deg, #ee5a6f 0%, #f368e0 100%)';
                    console.warn('[Dashboard] AI was enabled but fell back to rule-based');
                } else {
                    aiBadge.textContent = 'Rule-Based';
                    aiBadge.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
            });
        }

        // Update summary
        document.getElementById('ai-summary').textContent = insights.summary;

        // Update risk analysis
        console.log('[Dashboard] Risk analysis type:', typeof insights.riskAnalysis);
        console.log('[Dashboard] Risk analysis value:', insights.riskAnalysis);
        document.getElementById('ai-risk-analysis').textContent = insights.riskAnalysis;

        // Update recommendations
        const recommendationsList = document.getElementById('ai-recommendations');
        recommendationsList.innerHTML = '';
        insights.recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.textContent = recommendation;
            recommendationsList.appendChild(li);
        });

        console.log('[Dashboard] AI insights card updated successfully');

    } catch (error) {
        console.error('[Dashboard] Error loading AI insights:', error);
        document.getElementById('ai-summary').textContent = 'Unable to generate insights at this time.';
    } finally {
        // Remove loading state from refresh button
        const refreshBtn = document.getElementById('refresh-insights-btn');
        if (refreshBtn) {
            refreshBtn.classList.remove('loading');
            refreshBtn.style.pointerEvents = 'auto';
        }
    }
}

</script>

<style scoped>
.table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.table thead tr {
    background-color: #008198;
    color: #ffffff;
    text-align: left;
}

.table th,
.table td {
    padding: 12px 15px;
}


.table tbody tr {
    border-bottom: 1px solid #dddddd;
}

#dashboard-wrapper-container {
    display: inline-block;
    /* display: inline; */
    width: 9%;
    border: 1px solid red;
}

.table tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

#no-result {
    display: none;
    margin: 3%;
}
.border-info-fingerprint{
    border-bottom: 1px solid #04748833;
    font-size: 14px;
}
.border-info-fingerprint-fingerprintright{
    border-right: 1px solid #04748833;
}
.table tbody tr:last-of-type {
    border-bottom: 2px solid #008198;
}

.table tbody tr.active-row {
    font-weight: bold;
    color: #008198;
}

body {
    font-family: 'Nanum Gothic', sans-serif;
    background-color: #f6f7fb;
}

h1 {
    color: #333;
    border-bottom: 3px solid #6371ef;
    padding-bottom: 0.5rem;
}

canvas {
    width: 100%;
    height: auto;
    max-height: 400px;
    /* Adjust based on your preference */
}

button:hover {
    background-color: #4e5bc4;
    transform: translateY(-3px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
}

img {
    width: 50px;
}

#topTrackersChart {
    border-radius: 6px;
    box-shadow: 2px 4px 5px 4px #afa1a1a8;
}


.app {
    display: inline-block;
}

.div-header {
    padding: 10px 0;
    border-bottom: 1px solid #80808033;
}

.cover {
    height: 892px;

}

.color-047488 {
    color: #047488;
}

.div-header-primary{
    padding: 10px 0;
    border-bottom: 1px solid gray;
}

.custom-btn-color {
  background-color: #008198; /* Green background */
  color: white; /* White text */
  border: none; /* No border */
}

.custom-btn-color:hover {
  background-color: #004450; /* Darker green on hover */
}
.custom-pagination .page-item .page-link {
    background-color: #ffffff; /* New background color */
    color: #008198; /* Text color */
    border-color: #008198; /* Border color */
}

.custom-pagination .page-item .page-link:hover {
    background-color: #0c879d;
    border-color: #008198;
}
</style>


<style scoped>
@import './dashboard-styles.css';
</style>
