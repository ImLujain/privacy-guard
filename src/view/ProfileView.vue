<template>
  <div class="profile-container">
    <!-- Modern Header -->
    <div class="profile-header">
      <div class="header-icon">👤</div>
      <div>
        <h1>Change Profile</h1>
        <p class="header-subtitle">Switch between device fingerprints</p>
      </div>
    </div>

    <!-- Content Section -->
    <div class="profile-content">
      <!-- Profile Selector Card -->
      <div class="selector-card">
        <div class="selector-header">
          <span class="selector-icon">🔄</span>
          <h2>Select New Profile</h2>
        </div>
        <div class="selector-body">
          <label for="profileSelect" class="selector-label">Choose a device fingerprint:</label>
          <select id="profileSelect" v-model="selectedProfile" @change="handleProfileChange" class="profile-select">
            <option value="allProfiles">🔓 Real Identity (No Protection)</option>
            <option value="profile1">🖥️ Windows Desktop</option>
            <option value="profile2">💻 MacBook Air</option>
            <option value="profile3">📱 iPhone</option>
          </select>
        </div>
      </div>

      <!-- Comparison Grid -->
      <div class="comparison-container">
        <div class="comparison-grid">
          <!-- Current Profile Column -->
          <div class="profile-column current-column">
            <div class="column-header">
              <span class="column-icon">✓</span>
              <h3>Current Profile</h3>
            </div>
            <div class="profile-details">
              <div class="detail-row">
                <div class="detail-label">
                  <span class="detail-icon">🌐</span>
                  Profile Name
                </div>
                <div class="detail-value">{{ currentProfileData.name }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">
                  <span class="detail-icon">💻</span>
                  Device Type
                </div>
                <div class="detail-value">{{ currentProfileData.deviceType }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">
                  <span class="detail-icon">🔧</span>
                  User Agent
                </div>
                <div class="detail-value">{{ currentProfileData.userAgent }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">
                  <span class="detail-icon">📏</span>
                  Screen Size
                </div>
                <div class="detail-value">{{ currentProfileData.screenSize }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">
                  <span class="detail-icon">⚙️</span>
                  CPU Cores
                </div>
                <div class="detail-value">{{ currentProfileData.cpuCores }}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">
                  <span class="detail-icon">🧩</span>
                  Plugins
                </div>
                <div class="detail-value">{{ currentProfileData.plugins }}</div>
              </div>
            </div>
          </div>

          <!-- Arrow Separator -->
          <div class="arrow-separator">
            <div class="arrow-icon">→</div>
          </div>

          <!-- New Profile Column -->
          <div class="profile-column new-column">
            <div class="column-header">
              <span class="column-icon">🆕</span>
              <h3>Will Change To</h3>
            </div>
            <div class="profile-details">
              <div class="detail-row" :class="{ 'value-changed': currentProfileData.name !== newProfileData.name }">
                <div class="detail-label">
                  <span class="detail-icon">🌐</span>
                  Profile Name
                </div>
                <div class="detail-value">{{ newProfileData.name }}</div>
              </div>
              <div class="detail-row" :class="{ 'value-changed': currentProfileData.deviceType !== newProfileData.deviceType }">
                <div class="detail-label">
                  <span class="detail-icon">💻</span>
                  Device Type
                </div>
                <div class="detail-value">{{ newProfileData.deviceType }}</div>
              </div>
              <div class="detail-row" :class="{ 'value-changed': currentProfileData.userAgent !== newProfileData.userAgent }">
                <div class="detail-label">
                  <span class="detail-icon">🔧</span>
                  User Agent
                </div>
                <div class="detail-value">{{ newProfileData.userAgent }}</div>
              </div>
              <div class="detail-row" :class="{ 'value-changed': currentProfileData.screenSize !== newProfileData.screenSize }">
                <div class="detail-label">
                  <span class="detail-icon">📏</span>
                  Screen Size
                </div>
                <div class="detail-value">{{ newProfileData.screenSize }}</div>
              </div>
              <div class="detail-row" :class="{ 'value-changed': currentProfileData.cpuCores !== newProfileData.cpuCores }">
                <div class="detail-label">
                  <span class="detail-icon">⚙️</span>
                  CPU Cores
                </div>
                <div class="detail-value">{{ newProfileData.cpuCores }}</div>
              </div>
              <div class="detail-row" :class="{ 'value-changed': currentProfileData.plugins !== newProfileData.plugins }">
                <div class="detail-label">
                  <span class="detail-icon">🧩</span>
                  Plugins
                </div>
                <div class="detail-value">{{ newProfileData.plugins }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Apply Button -->
        <div class="action-container">
          <button class="apply-btn" @click="applyProfile" :disabled="currentProfile === selectedProfile">
            <span class="btn-icon">✨</span>
            <span>{{ currentProfile === selectedProfile ? 'Already Applied' : 'Apply New Profile' }}</span>
            <span class="btn-arrow" v-if="currentProfile !== selectedProfile">→</span>
          </button>
        </div>
      </div>

      <!-- Info Note -->
      <div class="info-note">
        <div class="note-icon">💡</div>
        <div class="note-content">
          <h4>Profile Information</h4>
          <p>
            Changing your profile will modify your browser's fingerprint to match the selected device.
            This helps protect your privacy by making your browser appear as a different device to websites.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Profile data definitions
const profilesData = {
  allProfiles: {
    name: 'Real Identity',
    deviceType: 'Your Actual Device',
    userAgent: 'Your Real Browser',
    screenSize: 'Your Real Screen',
    cpuCores: 'Your Real CPU',
    plugins: 'Your Real Plugins'
  },
  profile1: {
    name: 'Windows Desktop',
    deviceType: 'Desktop',
    userAgent: 'Chrome 131',
    screenSize: '1920 x 1080',
    cpuCores: '8 cores',
    plugins: '5 plugins'
  },
  profile2: {
    name: 'MacBook Air',
    deviceType: 'Laptop',
    userAgent: 'Safari 17.6',
    screenSize: '1440 x 900',
    cpuCores: '8 cores',
    plugins: '2 plugins'
  },
  profile3: {
    name: 'iPhone',
    deviceType: 'Mobile',
    userAgent: 'iOS 17.6',
    screenSize: '390 x 844',
    cpuCores: '6 cores',
    plugins: '0 plugins'
  }
};

// Reactive state
const currentProfile = ref('allProfiles');
const selectedProfile = ref('allProfiles');

// Computed properties
const currentProfileData = computed(() => {
  return profilesData[currentProfile.value as keyof typeof profilesData] || profilesData.allProfiles;
});

const newProfileData = computed(() => {
  return profilesData[selectedProfile.value as keyof typeof profilesData] || profilesData.allProfiles;
});

// Methods
const handleProfileChange = () => {
  // Update the new profile preview when dropdown changes
  console.log('Selected profile changed to:', selectedProfile.value);
};

const applyProfile = () => {
  if (currentProfile.value === selectedProfile.value) {
    return;
  }

  // Save to Chrome storage
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.set({ selectedProfile: selectedProfile.value }, () => {
      console.log('Profile saved:', selectedProfile.value);
      currentProfile.value = selectedProfile.value;

      // Show success message
      alert(`Profile changed to ${newProfileData.value.name}! Please reload your tabs for changes to take effect.`);
    });
  } else {
    console.error('Chrome storage API not available');
  }
};

// Load current profile on mount
onMounted(() => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    chrome.storage.local.get(['selectedProfile'], (data) => {
      if (data.selectedProfile) {
        currentProfile.value = data.selectedProfile;
        selectedProfile.value = data.selectedProfile;
      }
    });
  }
});
</script>

<style scoped>
/* Profile Container */
.profile-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Modern Header */
.profile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 48px 40px;
  color: white;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.header-icon {
  font-size: 64px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.profile-header h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.95;
  font-weight: 500;
}

/* Content */
.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
}

/* Selector Card */
.selector-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.selector-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f5f7fa;
}

.selector-icon {
  font-size: 32px;
}

.selector-header h2 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #2d3436;
}

.selector-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selector-label {
  font-size: 14px;
  font-weight: 600;
  color: #636e72;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-select {
  padding: 14px 20px;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #2d3436;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 400px;
}

.profile-select:hover {
  border-color: #667eea;
}

.profile-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Comparison Container */
.comparison-container {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 32px;
  margin-bottom: 32px;
}

/* Profile Columns */
.profile-column {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e1e8ed;
  transition: all 0.3s ease;
}

.profile-column:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.current-column {
  border-color: #26de81;
}

.new-column {
  border-color: #667eea;
}

.column-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.current-column .column-header {
  background: linear-gradient(135deg, #26de81 0%, #20bf6b 100%);
}

.column-icon {
  font-size: 24px;
}

.column-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

/* Profile Details */
.profile-details {
  padding: 0;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 16px 24px;
  border-bottom: 1px solid #e1e8ed;
  transition: background 0.2s ease;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row:hover {
  background: white;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

.detail-icon {
  font-size: 18px;
}

.detail-value {
  font-size: 14px;
  color: #2d3436;
  font-weight: 500;
  text-align: right;
}

/* Value Changed Highlight */
.value-changed {
  background: #fff3e0 !important;
  border-left: 4px solid #ff9800;
  padding-left: 20px !important;
}

.value-changed .detail-value {
  color: #e65100;
  font-weight: 700;
}

.value-changed .detail-label {
  color: #f57c00;
}

/* Arrow Separator */
.arrow-separator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 48px;
  color: #667eea;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* Action Container */
.action-container {
  text-align: center;
}

.apply-btn {
  padding: 16px 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.apply-btn:active {
  transform: translateY(0);
}

.apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.apply-btn:disabled:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-icon {
  font-size: 20px;
}

.btn-arrow {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.apply-btn:hover .btn-arrow {
  transform: translateX(4px);
}

/* Info Note */
.info-note {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 16px;
  padding: 24px 32px;
  display: flex;
  gap: 20px;
  border: 2px solid #64b5f6;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
}

.note-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.note-content h4 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 700;
  color: #1565c0;
}

.note-content p {
  margin: 0;
  color: #0d47a1;
  font-size: 14px;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 968px) {
  .comparison-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .arrow-separator {
    display: none;
  }
}

@media (max-width: 768px) {
  .profile-header {
    padding: 32px 24px;
    flex-direction: column;
    text-align: center;
  }

  .profile-header h1 {
    font-size: 28px;
  }

  .profile-content {
    padding: 24px 16px;
  }

  .selector-card,
  .comparison-container {
    padding: 24px 20px;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .detail-value {
    text-align: left;
    margin-top: 4px;
    padding-left: 26px;
  }

  .info-note {
    flex-direction: column;
    text-align: center;
    padding: 20px;
  }
}
</style>

