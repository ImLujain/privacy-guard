<template>
  <div class="settings-container">
    <!-- Modern Header -->
    <div class="settings-header">
      <div class="header-icon">⚙️</div>
      <div>
        <h1>Settings</h1>
        <p class="header-subtitle">Configure your privacy protection preferences</p>
      </div>
    </div>

    <!-- Content Section -->
    <div class="settings-content">
      <!-- AI Settings Card -->
      <div class="settings-card">
        <div class="card-header">
          <span class="card-icon">🤖</span>
          <h2>AI-Powered Insights</h2>
        </div>
        <div class="card-body">
          <p class="card-description">
            Enable AI-powered analysis using Ollama for advanced tracker insights and personalized recommendations.
            Requires Ollama running locally on your machine.
          </p>

          <div class="setting-item">
            <div class="setting-info">
              <label for="ai-toggle" class="setting-label">Enable AI Analysis</label>
              <p class="setting-description">
                Use local AI (Ollama) to generate detailed privacy insights and recommendations.
                Falls back to rule-based analysis if unavailable.
              </p>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="ai-toggle" v-model="aiConfig.enabled" @change="saveSettings">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <!-- AI Configuration (shown when enabled) -->
          <div v-if="aiConfig.enabled" class="ai-config-section">
            <div class="config-group">
              <label for="ollama-url" class="config-label">Ollama API URL</label>
              <input
                type="text"
                id="ollama-url"
                v-model="aiConfig.baseUrl"
                @change="saveSettings"
                class="config-input"
                placeholder="http://localhost:11434"
              >
            </div>

            <div class="config-group">
              <label for="ollama-model" class="config-label">Model Name</label>
              <input
                type="text"
                id="ollama-model"
                v-model="aiConfig.model"
                @change="saveSettings"
                class="config-input"
                placeholder="llama2"
              >
              <p class="config-hint">Available models: llama2, mistral, phi, etc.</p>
            </div>

            <div class="config-group">
              <label for="ollama-timeout" class="config-label">Timeout (milliseconds)</label>
              <input
                type="number"
                id="ollama-timeout"
                v-model.number="aiConfig.timeout"
                @change="saveSettings"
                class="config-input"
                min="5000"
                max="60000"
                step="1000"
              >
            </div>

            <!-- Connection Status -->
            <div class="status-section">
              <button @click="testConnection" class="test-btn" :disabled="testing">
                {{ testing ? 'Testing...' : 'Test Connection' }}
              </button>
              <div v-if="connectionStatus" class="status-message" :class="connectionStatus.type">
                {{ connectionStatus.message }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Installation Guide Card -->
      <div class="settings-card">
        <div class="card-header">
          <span class="card-icon">📚</span>
          <h2>How to Install Ollama</h2>
        </div>
        <div class="card-body">
          <div class="guide-steps">
            <div class="guide-step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Download Ollama</h3>
                <p>Visit <a href="https://ollama.ai" target="_blank">ollama.ai</a> and download for your platform (Windows, Mac, or Linux)</p>
              </div>
            </div>

            <div class="guide-step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Install and Run</h3>
                <p>Follow the installation instructions and start Ollama. It will run on <code>localhost:11434</code> by default.</p>
              </div>
            </div>

            <div class="guide-step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Download a Model</h3>
                <p>Open terminal and run: <code>ollama pull llama2</code></p>
                <p class="step-note">Other options: mistral, phi, codellama</p>
              </div>
            </div>

            <div class="guide-step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>Enable AI in Settings</h3>
                <p>Toggle "Enable AI Analysis" above and test the connection. Your insights will now be powered by AI!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Card -->
      <div class="info-card">
        <div class="info-icon">ℹ️</div>
        <div class="info-content">
          <h3>Privacy Notice</h3>
          <p>
            All AI analysis happens locally on your machine. No data is sent to external servers.
            Your tracking data and insights remain completely private.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAIConfig, saveAIConfig, checkOllamaAvailability, type OllamaConfig } from '../services/aiService';

const aiConfig = ref<OllamaConfig>({
  enabled: false,
  baseUrl: 'http://localhost:11434',
  model: 'llama2',
  timeout: 30000
});

const testing = ref(false);
const connectionStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null);

onMounted(async () => {
  const config = await getAIConfig();
  aiConfig.value = config;
});

async function saveSettings() {
  await saveAIConfig(aiConfig.value);
  connectionStatus.value = null; // Clear status when settings change
}

async function testConnection() {
  testing.value = true;
  connectionStatus.value = null;

  try {
    const isAvailable = await checkOllamaAvailability(aiConfig.value);

    if (isAvailable) {
      connectionStatus.value = {
        type: 'success',
        message: '✅ Successfully connected to Ollama! AI insights are ready to use.'
      };
    } else {
      connectionStatus.value = {
        type: 'error',
        message: '❌ Unable to connect to Ollama. Make sure it is running and the URL is correct.'
      };
    }
  } catch (error) {
    connectionStatus.value = {
      type: 'error',
      message: '❌ Connection failed. Please check if Ollama is installed and running.'
    };
  } finally {
    testing.value = false;
  }
}
</script>

<style scoped>
/* Settings Container */
.settings-container {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Modern Header */
.settings-header {
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

.settings-header h1 {
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
.settings-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
}

/* Settings Cards */
.settings-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.settings-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f5f7fa;
}

.card-icon {
  font-size: 32px;
}

.card-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #2d3436;
}

.card-body {
  color: #636e72;
  line-height: 1.8;
}

.card-description {
  margin: 0 0 24px 0;
  font-size: 15px;
  color: #636e72;
}

/* Setting Item */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 24px;
  gap: 24px;
}

.setting-info {
  flex: 1;
}

.setting-label {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #2d3436;
  margin-bottom: 8px;
}

.setting-description {
  margin: 0;
  font-size: 14px;
  color: #636e72;
  line-height: 1.6;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  flex-shrink: 0;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* AI Config Section */
.ai-config-section {
  margin-top: 24px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px solid #e1e8ed;
}

.config-group {
  margin-bottom: 20px;
}

.config-group:last-child {
  margin-bottom: 0;
}

.config-label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #2d3436;
  margin-bottom: 8px;
}

.config-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  color: #2d3436;
  transition: all 0.3s ease;
}

.config-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.config-hint {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #95a5a6;
  font-style: italic;
}

/* Status Section */
.status-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px solid #e1e8ed;
}

.test-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.test-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.test-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-message {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.status-message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Guide Steps */
.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guide-step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.step-content {
  flex: 1;
}

.step-content h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 700;
  color: #2d3436;
}

.step-content p {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #636e72;
  line-height: 1.6;
}

.step-content p:last-child {
  margin-bottom: 0;
}

.step-content a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.step-content a:hover {
  text-decoration: underline;
}

.step-content code {
  background: #2d3436;
  color: #a8dadc;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-family: 'Courier New', monospace;
}

.step-note {
  font-style: italic;
  color: #95a5a6;
  font-size: 13px;
}

/* Info Card */
.info-card {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  gap: 20px;
  border: 2px solid #64b5f6;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
}

.info-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.info-content h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1565c0;
}

.info-content p {
  margin: 0;
  color: #0d47a1;
  font-size: 14px;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-header {
    padding: 32px 24px;
    flex-direction: column;
    text-align: center;
  }

  .settings-header h1 {
    font-size: 28px;
  }

  .settings-content {
    padding: 24px 16px;
  }

  .settings-card {
    padding: 24px 20px;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .guide-step {
    flex-direction: column;
  }

  .info-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
