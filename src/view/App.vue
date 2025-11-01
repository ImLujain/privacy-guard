<template>
  <div class="app-container">
    <nav class="modern-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">🛡️</div>
        <h2 class="sidebar-title">Privacy Guard</h2>
        <p class="sidebar-subtitle">Browser Protection</p>
      </div>

      <ul class="sidebar-nav">
        <li>
          <router-link to="/" class="nav-item">
            <span class="nav-icon">📊</span>
            <span class="nav-label">Dashboard</span>
          </router-link>
        </li>
        <li>
          <router-link to="/about" class="nav-item">
            <span class="nav-icon">🔍</span>
            <span class="nav-label">Browser Fingerprint</span>
          </router-link>
        </li>
        <li>
          <router-link to="/change-profile" class="nav-item">
            <span class="nav-icon">👤</span>
            <span class="nav-label">Change Profile</span>
          </router-link>
        </li>
        <li>
          <router-link to="/settings" class="nav-item">
            <span class="nav-icon">⚙️</span>
            <span class="nav-label">Settings</span>
          </router-link>
        </li>
        <li>
          <div @click="goToExternalLink" class="nav-item nav-external">
            <span class="nav-icon">📝</span>
            <span class="nav-label">Usage Survey</span>
            <span class="external-indicator">↗</span>
          </div>
        </li>
      </ul>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>


<script>
export default {
  methods: {
    goToExternalLink() {
      window.open('https://survey.sogolytics.com/r/Yq5tGW', '_blank');
    }
  }
}
</script>

<style scoped>
/* Modern App Layout */
.app-container {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
}

/* Modern Sidebar */
.modern-sidebar {
  width: 260px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

/* Sidebar Header */
.sidebar-header {
  padding: 32px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.sidebar-logo {
  font-size: 48px;
  margin-bottom: 12px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.sidebar-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
}

.sidebar-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 500;
}

/* Sidebar Navigation */
.sidebar-nav {
  list-style: none;
  padding: 24px 16px;
  margin: 0;
  flex: 1;
}

.sidebar-nav li {
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.nav-item.router-link-active {
  background: white;
  color: #667eea;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  border-color: white;
}

.nav-icon {
  font-size: 20px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.nav-item:hover .nav-icon {
  transform: scale(1.1);
}

.nav-label {
  flex: 1;
  font-size: 14px;
}

.nav-external {
  justify-content: space-between;
}

.external-indicator {
  font-size: 16px;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.nav-item:hover .external-indicator {
  opacity: 1;
  transform: translateX(2px) translateY(-2px);
}

/* Main Content Area */
.main-content {
  flex: 1;
  overflow-y: auto;
}

/* Scrollbar Styling for Sidebar */
.modern-sidebar::-webkit-scrollbar {
  width: 6px;
}

.modern-sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.modern-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.modern-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Responsive Design */
@media (max-width: 968px) {
  .modern-sidebar {
    width: 240px;
  }

  .sidebar-header {
    padding: 24px 16px;
  }

  .sidebar-title {
    font-size: 20px;
  }

  .nav-label {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }

  .modern-sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 16px;
  }

  .sidebar-nav li {
    margin-bottom: 0;
  }

  .nav-item {
    flex-direction: column;
    text-align: center;
    padding: 12px;
  }

  .nav-icon {
    font-size: 24px;
  }

  .nav-label {
    font-size: 12px;
  }

  .external-indicator {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 12px;
  }
}
</style>